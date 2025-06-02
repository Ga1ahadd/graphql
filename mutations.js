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
  mutation AddComment($postId: ID!, $text: String!) {
    addComment(postId: $postId, text: $text) {
      id
      text
      createdAt
      userId {
        id
        username
      }
    }
  }
`