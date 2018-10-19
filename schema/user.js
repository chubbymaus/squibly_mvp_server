export default `

  type User {
    id: Int!
    firstname: String!
    lastname: String!
    jobtitle: String!
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
    register(firstname: String!, lastname: String!, username: String!, jobtitle: String!, email: String!, password: String!): RegisterResponse!
    login(email: String!, password: String!): LoginResponse!
  }

`;
