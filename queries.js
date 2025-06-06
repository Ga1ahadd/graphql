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
      id
      name
      description
    }
  }
`

export const GET_COMMUNITY_BY_ID = gql`
  query GetCommunity($id: ID!) {
    community(id: $id) {
      id
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

export const GET_POSTS_BY_COMMUNITY = gql`
  query GetPostsByCommunity($id: ID!) {
    postsByCommunity(id: $id) {
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

export const GET_NON_MEMBERS = gql`
  query GetNonMembers($communityId: ID!) {
    nonMembers(communityId: $communityId) {
      id
      username
      email
      avatar
    }
  }
`
