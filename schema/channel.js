export default `

  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    passphrase: String!
    publicKey: String!
    privateKey: String!
    sigPublicKey: String!
    sigPrivateKey: String!
    users: [User!]!
    dm: Boolean!
  }

  type ChannelResponse {
    ok: Boolean!
    channel: Channel
    errors: [Error!]
  }

  type DMChannelResponse {
    id: Int!
    name: String!
  }

  type Mutation {
    createChannel(teamId: Int!, name: String!, public: Boolean=false, passphrase: String!, publicKey: String!, privateKey: String!, sigPublicKey: String!, sigPrivateKey: String!, members: [Int!]=[]): ChannelResponse!
    getOrCreateChannel(teamId: Int!, members: [Int!]!): DMChannelResponse!
  }
`;
