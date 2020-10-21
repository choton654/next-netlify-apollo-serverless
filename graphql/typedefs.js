const { gql } = require("apollo-server-lambda");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }
  type Query {
    getUsers: [User!]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
  }
`;
