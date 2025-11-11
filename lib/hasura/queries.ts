import { gql } from "@apollo/client";

/**
 * Example query to get all users
 * Replace 'users' with your actual table name
 */
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      created_at
    }
  }
`;

/**
 * Example query to get a single user by ID
 */
export const GET_USER_BY_ID = gql`
  query GetUserById($id: uuid!) {
    users_by_pk(id: $id) {
      id
      email
      created_at
    }
  }
`;

/**
 * Example mutation to insert a new user
 */
export const INSERT_USER = gql`
  mutation InsertUser($email: String!) {
    insert_users_one(object: { email: $email }) {
      id
      email
      created_at
    }
  }
`;

/**
 * Example mutation to update a user
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($id: uuid!, $email: String!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: { email: $email }) {
      id
      email
      created_at
    }
  }
`;

/**
 * Example mutation to delete a user
 */
export const DELETE_USER = gql`
  mutation DeleteUser($id: uuid!) {
    delete_users_by_pk(id: $id) {
      id
    }
  }
`;
