import { gql } from '@apollo/client'

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      image
      description
      createdAt
      userId {
        id
        username
        avatar
      }
      comments {
        id
        text
        createdAt
        userId {
          id
          username
          avatar
        }
      }
    }
  }
`
