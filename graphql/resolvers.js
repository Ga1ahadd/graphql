import { PubSub, withFilter } from "graphql-subscriptions";
import User from "./models/user.js";
import Post from "./models/post.js";
import Comment from "./models/comment.js";
import Community from "./models/community.js";

const pubsub = new PubSub();

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

    nonMembers: async (_, { communityId }) => {
      const community = await Community.findById(communityId);
      if (!community) throw new Error("Community not found");
      const memberIds = community.members.map(id => id.toString());
      return await User.find({ _id: { $nin: memberIds } });
    },

    community: async (_, { id }) => {
      return await Community.findById(id).populate("members");
    },

    postsByCommunity: async (_, { id }) => {
      const community = await Community.findById(id);
      if (!community) return [];

      const memberIds = community.members.map(m => m._id || m);

      return await Post.find({ userId: { $in: memberIds } })
        .populate("userId")
        .populate("comments")
        .sort({ createdAt: -1 });
    }
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

    addCommunity: async (_, { name, description }) => {
      const defaultUserId = "65f1a1a1a1a1a1a1a1a1a1a1"; // exemple fixe
      const community = new Community({
        name,
        description,
        members: [defaultUserId]
      });
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
    }
  },

  Subscription: {
    newPost: {
      subscribe: () => pubsub.asyncIterator(["NEW_POST"]),
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
