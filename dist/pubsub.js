"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlRedisSubscriptions = require("graphql-redis-subscriptions");

var _default = new _graphqlRedisSubscriptions.RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: 6379,
    retry_strategy: options => Math.max(options.attempt * 100, 3000)
  }
}); // import { PubSub } from 'graphql-subscriptions';
// export default new PubSub();


exports.default = _default;