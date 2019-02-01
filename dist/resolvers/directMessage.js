"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlSubscriptions = require("graphql-subscriptions");

var _permissions = _interopRequireWildcard(require("../permissions"));

var _pubsub = _interopRequireDefault(require("../pubsub"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE ';
var _default = {
  Subscription: {
    newDirectMessage: {
      subscribe: _permissions.directMessageSubscription.createResolver((0, _graphqlSubscriptions.withFilter)(() => _pubsub.default.asyncIterator(NEW_DIRECT_MESSAGE), (payload, args, {
        user
      }) => payload.teamId === args.teamId && (payload.senderId === user.id && payload.receiverId === args.userId || payload.senderId === args.userId && payload.receiverId === user.id)))
    }
  },
  DirectMessage: {
    sender: ({
      sender,
      senderId
    }, args, {
      models
    }) => {
      if (sender) {
        return sender;
      }

      return models.User.findOne({
        where: {
          id: senderId
        }
      }, {
        raw: true
      });
    },
    receiver: ({
      receiver,
      receiverId
    }, args, {
      models
    }) => {
      if (receiver) {
        return receiver;
      }

      return models.User.findOne({
        where: {
          id: receiverId
        }
      }, {
        raw: true
      });
    }
  },
  Query: {
    directMessages: _permissions.default.createResolver(async (parent, {
      teamId,
      otherUserId
    }, {
      models,
      user
    }) => models.DirectMessage.findAll({
      order: [['created_at', 'ASC']],
      where: {
        teamId,
        [models.sequelize.Op.or]: [{
          [models.sequelize.Op.and]: [{
            receiverId: otherUserId
          }, {
            senderId: user.id
          }]
        }, {
          [models.sequelize.Op.and]: [{
            receiverId: user.id
          }, {
            senderId: otherUserId
          }]
        }]
      }
    }, {
      raw: true
    }))
  },
  Mutation: {
    createDirectMessage: _permissions.default.createResolver(async (parent, args, {
      models,
      user
    }) => {
      try {
        const directMessage = await models.DirectMessage.create(_objectSpread({}, args, {
          senderId: user.id
        }));

        _pubsub.default.publish(NEW_DIRECT_MESSAGE, {
          teamId: args.teamId,
          senderId: user.id,
          sender_name: args.sender_name,
          receiver_name: args.receiver_name,
          session_key: args.session_key,
          signature: args.signature,
          receiverId: args.receiverId,
          newDirectMessage: _objectSpread({}, directMessage.dataValues, {
            sender: {
              username: user.username
            }
          })
        });

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    })
  }
};
exports.default = _default;