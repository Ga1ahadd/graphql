import { PubSub, withFilter } from "graphql-subscriptions"
import User from "./models/user.js"
import Post from "./models/post.js"
import Comment from "./models/comment.js"
import Community from "./models/community.js"

const pubsub = new PubSub()

const resolvers = {
  Query: {
    users: async () => {
      const test = await User.find();
      console.log(test);
      return test;
    },
    user: async (_, { id }) => await User.findById(id),

    posts: async () =>
      await Post.find()
        .populate("userId")
        .populate("comments")
        .sort({ createdAt: -1 }),

    post: async (_, { id }) => await Post.findById(id).populate("userId"),

    comments: async (_, { postId }) => await Comment.find({ postId }).populate("userId"),

    communitiesByUser: async () => {
      const userId = "65f1a1a1a1a1a1a1a1a1a1a1"; // exemple fixe
      return await Community.find({ members: userId });
    },
    community: async (_, { idCommunity }) => {
    return await Community.findOne({ idCommunity }).populate("members")
  },
  },

  Mutation: {
    addComment: async (_, { postId, text }) => {
      const userId = "65f1a1a1a1a1a1a1a1a1a1a1"; // exemple fixe

      try {
        const newComment = new Comment({ postId, userId, text });
        await newComment.save();
        await Post.findByIdAndUpdate(postId, {
          $push: { comments: newComment._id },
        });

        return newComment;
      } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error);
        throw new Error("Impossible d'ajouter le commentaire");
      }
    },
  },

  Subscription: {
    newPost: {
      subscribe: () => {
        return pubsub.asyncIterableIterator(["NEW_POST"]);
      },
    },
  },

  User: {
    id: (parent) => parent._id.toString(),
  },

  Post: {
    id: (parent) => parent._id.toString(),

    userId: async (parent) => {
      return await User.findById(parent.userId);
    },

    comments: async (parent) => {
      const comments = await Comment.find({ _id: { $in: parent.comments } });
      return comments.filter(c =>
        c.text && typeof c.text === "string" &&
        c.userId !== null && c.userId !== undefined
      );
    },
  },

  Comment: {
    id: (parent) => parent._id.toString(),

    userId: async (parent) => {
      return await User.findById(parent.userId);
    },
  },
};

export default resolvers;
