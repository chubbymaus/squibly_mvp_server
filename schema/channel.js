export default `

  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    passphraseHint: String!
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

  type Query {
    getChannelPublicKey( channelId: Int! ): Channel
    getChannelPrivateKey( channelId: Int! ): Channel
    getChannelSigPublicKey( channelId: Int! ): Channel
    getChannelSigPrivateKey( channelId: Int! ): Channel
  }

  type DMChannelResponse {
    id: Int!
    name: String!
  }

  type Mutation {
    createChannel(teamId: Int!, name: String!, public: Boolean=false, passphraseHint: String!, publicKey: String!, privateKey: String!, sigPublicKey: String!, sigPrivateKey: String!, members: [Int!]=[]): ChannelResponse!
    getOrCreateChannel(teamId: Int!, members: [Int!]!): DMChannelResponse!
  }
`;
