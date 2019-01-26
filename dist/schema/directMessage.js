"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n\n  type DirectMessage {\n    id: Int!\n    text: String!\n    sender_name: String!\n    receiver_name: String!\n    sender: User!\n    receiver: User!\n    receiverId: Int!\n    created_at: String!\n    session_key: String\n    signature: String\n  }\n\n  type Subscription {\n    newDirectMessage(teamId: Int!, userId: Int!): DirectMessage!\n  }\n\n  type Query {\n    directMessages(teamId: Int!, otherUserId: Int!): [DirectMessage!]!\n  }\n\n  type Mutation {\n    createDirectMessage(receiverId: Int!, text: String!, sender_name: String!, receiver_name: String!, session_key: String, signature: String, teamId: Int!): Boolean!\n  }\n\n";