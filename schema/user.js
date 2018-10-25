export default `

  type User {
    id: Int!
    firstName: String!
    lastName: String!
    jobTitle: String!
    passphrase: String!
    publicKey: String!
    privateKey: String!
    sigPublicKey: String!
    sigPrivateKey: String!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type Query {
    me: User!
    allUsers: [User!]!
    getUser( userId: Int! ): User
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
    register(firstName: String!, lastName: String!, username: String!, jobTitle: String!, passphrase: String!, publicKey: String!, privateKey: String!, sigPublicKey: String!, sigPrivateKey: String!, email: String!, password: String!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }

`;
