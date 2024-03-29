"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = `

  type User {
    id: Int!
    firstname: String!
    lastname: String!
    jobtitle: String!
    passphrase_hint: String!
    public_key: String!
    private_key: String!
    sig_public_key: String!
    sig_private_key: String!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type Query {
    me: User!
    allUsers: [User!]!
    getUserPublicKeys( userName: String! ): User
    getUserPrivateKeys( userName: String! ): User
    getUser( userId: Int! ): User
    passPhrase: User!
  }

  type RegisterResponse {
    ok: Boolean!
    user: User
    errors: [Error!]
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    refreshToken: String
    
    errors: [Error!]
  }

  type Mutation {
    register(firstname: String!, lastname: String!, username: String!, jobtitle: String!, passphrase_hint: String!, public_key: String!, private_key: String!, sig_public_key: String!, sig_private_key: String!, email: String!, password: String!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }

`;
exports.default = _default;