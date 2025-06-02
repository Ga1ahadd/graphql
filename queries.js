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

export const GET_USER_COMMUNITIES = gql`
  query {
    communitiesByUser {
      idCommunity
      name
      description
    }
  }
`

export const GET_COMMUNITY_BY_ID = gql`
  query GetCommunity($idCommunity: Int!) {
    community(idCommunity: $idCommunity) {
      name
      description
      members {
        id
        username
        fullName
        avatar
      }
    }
  }
`
