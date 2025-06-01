import { gql } from '@apollo/client'

export const ADD_POST = gql`
  mutation AddPost($userId: ID!, $image: String!, $description: String!) {
    addPost(userId: $userId, image: $image, description: $description) {
      id
      image
      description
      createdAt
      likes
      user {
        id
        username
        avatar
      }
      comments {
        id
        text
      }
    }
  }
`

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $userId: ID!, $text: String!) {
    addComment(postId: $postId, userId: $userId, text: $text) {
      id
      text
      createdAt
      user {
        id
        username
      }
    }
  }
`