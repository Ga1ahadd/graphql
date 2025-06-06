import { gql } from "apollo-server-express"

const typeDefs = gql`
  # Types
  type User {
    id: ID!
    username: String!
    fullName: String!
    email: String!
    password: String!
    avatar: String!
    createdAt: String!
    bio: String
    followers: [User!]!
    following: [User!]!
  }

  type Post {
    id: ID!
    userId: User!
    image: String!
    description: String
    likes: [User!]!
    comments: [Comment!]!
    createdAt: String!
  }

  type Comment {
    id: ID!
    postId: ID!
    userId: User!
    text: String!
    createdAt: String!
  }

  type Community {
    id: ID!
    name: String!
    description: String
    members: [User!]!
    createdAt: String
  }

  # Requêtes
  type Query {
    users: [User]
    user(id: ID!): User
    posts: [Post]
    post(id: ID!): Post
    comments(postId: ID!): [Comment]

    communitiesByUser: [Community!]!
    community(id: ID!): Community
    postsByCommunity(id: ID!): [Post!]!
    nonMembers(communityId: ID!): [User!]!
  }

  # Mutations
  type Mutation {
    addComment(postId: ID!, text: String!): Comment
    addCommunity(name: String!, description: String): Community
    updateCommunity(id: ID!, name: String, description: String): Community
    deleteCommunity(id: ID!): Boolean
    addMemberToCommunity(communityId: ID!, userId: ID!): Community
  }

  # Subscriptions
  type Subscription {
    newPost: Post
  }
`

export default typeDefs
