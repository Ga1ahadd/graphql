// graphql/schema.js
import { gql } from "apollo-server-express"

const typeDefs = gql`
  # Types
  type User {
    id: ID!
    username: String!
    fullname: String!
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

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Requêtes
  type Query {
    users: [User]
    user: User
    posts: [Post]
    post: Post
    comments(postId: ID!): [Comment]
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
