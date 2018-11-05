export default `

  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
    passphrase_hint: String!
    public_key: String!
    private_key: String!
    sig_public_key: String!
    sig_private_key: String!
    users: [User!]!
    dm: Boolean!
  }

  type ChannelResponse {
    ok: Boolean!
    channel: Channel
    errors: [Error!]
  }

  type Query {
    getChannelPublicKeys( channelId: Int! ): Channel
    getChannelPrivateKeys( channelId: Int! ): Channel
  }

  type DMChannelResponse {
    id: Int!
    name: String!
  }

  type Mutation {
    createChannel(teamId: Int!, name: String!, public: Boolean=false, passphrase_hint: String!, public_key: String!, private_key: String!, sig_public_key: String!, sig_private_key: String!, members: [Int!]=[]): ChannelResponse!
    getOrCreateChannel(teamId: Int!, members: [Int!]!): DMChannelResponse!
  }
`;
