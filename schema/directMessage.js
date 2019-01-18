export default `

  type DirectMessage {
    id: Int!
    text: String!
    sender_name: String!
    receiver_name: String!
    sender: User!
    receiver: User!
    receiverId: Int!
    created_at: String!
    session_key: String
    signature: String
  }

  type Subscription {
    newDirectMessage(teamId: Int!, userId: Int!): DirectMessage!
  }

  type Query {
    directMessages(teamId: Int!, otherUserId: Int!): [DirectMessage!]!
  }

  type Mutation {
    createDirectMessage(receiverId: Int!, text: String!, sender_name: String!, receiver_name: String!, session_key: String, signature: String, teamId: Int!): Boolean!
  }

`;
