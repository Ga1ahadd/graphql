import { PubSub, withFilter } from "graphql-subscriptions";
import User from "./models/user.js";
import Post from "./models/post.js";
import Comment from "./models/comment.js";
import Community from "./models/community.js";

const pubsub = new PubSub();

const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),

    posts: async () =>
      await Post.find()
        .populate("userId")
        .populate("comments")
        .sort({ createdAt: -1 }),

    post: async (_, { id }) => await Post.findById(id).populate("userId"),

    comments: async (_, { postId }) => await Comment.find({ postId }).populate("userId"),

    communitiesByUser: async (_, { userId }) => {
      return await Community.find({ members: userId });
    },

    nonMembers: async (_, { communityId }) => {
      const community = await Community.findById(communityId);
      if (!community) throw new Error("Community not found");
      const memberIds = community.members.map(id => id.toString());
      return await User.find({ _id: { $nin: memberIds } });
    },

    community: async (_, { id }) => await Community.findById(id).populate("members"),

    postsByCommunity: async (_, { id }) => {
      const community = await Community.findById(id);
      if (!community) return [];
      const memberIds = community.members.map(m => m._id || m);
      return await Post.find({ userId: { $in: memberIds } })
        .populate("userId")
        .populate("comments")
        .sort({ createdAt: -1 });
    },
  },

  Mutation: {
    addComment: async (_, { postId, text, userId }) => {
      const newComment = new Comment({ postId, userId, text });
      await newComment.save();
      await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
      return newComment;
    },

    addCommunity: async (_, { name, description, userId }) => {
      const community = new Community({ name, description, members: userId });
      await community.save();
      return await community.populate("members");
    },

    updateCommunity: async (_, { id, name, description }) => {
      const community = await Community.findById(id);
      if (!community) throw new Error("Community not found");
      if (name !== undefined) community.name = name;
      if (description !== undefined) community.description = description;
      await community.save();
      return community;
    },

    deleteCommunity: async (_, { id }) => {
      const result = await Community.findByIdAndDelete(id);
      return !!result;
    },

    addMemberToCommunity: async (_, { communityId, userId }) => {
      const community = await Community.findById(communityId);
      if (!community) throw new Error("Community not found");
      if (!community.members.includes(userId)) {
        community.members.push(userId);
        await community.save();
      }
      return await community.populate("members");
    },

    register: async (_, { username, email, password, fullName, avatar, bio }) => {
      console.log("Tentative d'inscription avec :", {
        username, email, password, fullName, avatar, bio
      });

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("Email déjà utilisé :", email);
        throw new Error("Email déjà utilisé");
      }

      const newUser = new User({
        username,
        email,
        password,
        fullName,
        avatar,
        createdAt: new Date(),
        bio,
        followers: [],
        following: []
      });

      await newUser.save();
      console.log("Utilisateur créé :", newUser);
      return newUser;
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        throw new Error("Email ou mot de passe invalide");
      }
      return user;
    },
    addPost: async (_, { userId, image, description }) => {
      try {
        const newPost = new Post({
          userId,
          image,
          description,
          createdAt: new Date(),
          likes: [],
          comments: []
        });
        await newPost.save();
        return await newPost.populate("userId");
      } catch (error) {
        console.error("Erreur lors de la création du post :", error);
        throw new Error("Échec de la création du post.");
      }
    }
  },

  Subscription: {
    newComment: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator(["NEW_COMMENT"]),
        (payload, variables) => payload.newComment.postId.toString() === variables.postId.toString()
      ),
    },
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
    userId: async (parent) => await User.findById(parent.userId),
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
    userId: async (parent) => await User.findById(parent.userId),
  },
};

export default resolvers;
