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

export const ADD_MEMBER_TO_COMMUNITY = gql`
  mutation AddMemberToCommunity($communityId: ID!, $userId: ID!) {
    addMemberToCommunity(communityId: $communityId, userId: $userId) {
      id
      name
      members {
        id
        username
        fullName
      }
    }
  }
`

export const ADD_COMMUNITY = gql`
  mutation AddCommunity($name: String!, $description: String) {
    addCommunity(name: $name, description: $description) {
      id
      name
      description
    }
  }
`

export const UPDATE_COMMUNITY = gql`
  mutation UpdateCommunity($id: ID!, $name: String, $description: String) {
    updateCommunity(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`

export const DELETE_COMMUNITY = gql`
  mutation DeleteCommunity($id: ID!) {
    deleteCommunity(id: $id)
  }
`
