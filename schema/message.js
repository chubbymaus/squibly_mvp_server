export default `

  type Message {
    id: Int!
    text: String
    user: User!
    channel: Channel!
    created_at: String!
    session_key: String!
    signature: String!
    url: String
    filetype: String
    filename: String
  }

  input File {
    type: String!,
    path: String!,
    name: String
  
  }

  type Subscription {
    newChannelMessage(channelId: Int!): Message!
  }

  type Query {
    messages(cursor: String, channelId: Int!): [Message!]!
  }

  type Mutation {
    createMessage(channelId: Int!, text: String, session_key: String, signature: String, file: File): Boolean!
  }

`;
