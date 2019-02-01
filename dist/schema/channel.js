"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = `

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
    getChannelPublicKeys( channelName: String! ): Channel
    getChannelPrivateKeys( channelName: String! ): Channel
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
exports.default = _default;