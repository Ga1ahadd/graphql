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
    idCommunity: Int!
    name: String!
    description: String
    members: [User!]!
    createdAt: String
  }

  # Requêtes
  type Query {
    users: [User]
    user: User
    posts: [Post]
    post: Post
    comments(postId: ID!): [Comment]

    communitiesByUser: [Community!]!
    community(idCommunity: Int!): Community
  }

  # Mutations
  type Mutation {
    addComment(postId: ID!, text: String!): Comment
  }

  # Subscriptions
  type Subscription {
    newPost: Post
  }
`

export default typeDefs
