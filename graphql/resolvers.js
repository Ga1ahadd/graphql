import { PubSub, withFilter } from "graphql-subscriptions"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "./models/user.js"
import Post from "./models/post.js"
import Comment from "./models/comment.js"

const pubsub = new PubSub()
const JWT_SECRET = process.env.JWT_SECRET || "changeme"

const resolvers = {
  Query: {
    users: async () => {
      const test = await User.find()
      console.log(test)
      return test
    },
    user: async (_, { id }) => await User.findById(id),
    posts: async () =>
      await Post.find()
        .populate("userId")
        .populate("comments")
        .sort({ createdAt: -1 }),
    post: async (_, { id }) => await Post.findById(id).populate("userId"),
    comments: async (_, { postId }) => await Comment.find({ postId }).populate("userId"),
  },

  Mutation: {
    signup: async (_, { email, password }) => {
      const existingUser = await User.findOne({ email })
      if (existingUser) throw new Error("Email déjà utilisé")

      const user = await User.create({ email, password })
      const token = jwt.sign({ userId: user._id }, JWT_SECRET)
      return { token, user }
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email })
      if (!user) throw new Error("Utilisateur non trouvé")

      if (user.password !== password) {
        throw new Error("Mot de passe incorrect")
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET)
      return { token, user }
    },

    addComment: async (_, { postId, text }, { userId }) => {
      if (!userId) throw new Error("Non authentifié")

      try {
        const newComment = new Comment({ postId, userId, text })
        await newComment.save()
        await Post.findByIdAndUpdate(postId, {
          $push: { comments: newComment._id },
        })

        return newComment
      } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error)
        throw new Error("Impossible d'ajouter le commentaire")
      }
    },
  },

  Subscription: {
    newPost: {
      subscribe: () => {
        return pubsub.asyncIterableIterator(["NEW_POST"])
      },
    },
  },

  User: {
    id: (parent) => parent._id.toString(),
  },

  Post: {
    id: (parent) => parent._id.toString(),

    userId: async (parent) => {
      return await User.findById(parent.userId)
    },

    comments: async (parent) => {
      const comments = await Comment.find({ _id: { $in: parent.comments } })
      return comments.filter(c =>
        c.text && typeof c.text === "string" &&
        c.userId !== null && c.userId !== undefined
      )
    },
  },

  Comment: {
    id: (parent) => parent._id.toString(),

    userId: async (parent) => {
      return await User.findById(parent.userId)
    },
  },
}

export default resolvers
