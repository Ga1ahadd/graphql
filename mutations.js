import { gql } from '@apollo/client'

export const ADD_POST = gql`
  mutation AddPost($userId: ID!, $image: String!, $description: String!) {
    addPost(userId: $userId, image: $image, description: $description) {
      id
      image
      description
      createdAt
      userId {
        id
        username
        avatar
      }
      likes {
        id
        username
      }
      comments {
        id
        text
      }
    }
  }
`

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $text: String!, $userId: ID!) {
    addComment(postId: $postId, text: $text, userId: $userId) {
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
  mutation AddCommunity($name: String!, $description: String, $userId: ID!) {
    addCommunity(name: $name, description: $description, userId: $userId) {
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

export const REGISTER_USER = gql`
  mutation Register($username: String!, $fullName: String!, $email: String!, $password: String!, $avatar: String!, $bio: String!) {
    register(username: $username, fullName: $fullName, email: $email, password: $password, avatar: $avatar, bio: $bio) {
      id
      username
      email
      avatar
    }
  }
`

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      username
      email
      avatar
    }
  }
`