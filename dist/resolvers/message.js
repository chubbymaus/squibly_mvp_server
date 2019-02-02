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

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';
var _default = {
  Subscription: {
    newChannelMessage: {
      subscribe: _permissions.requiresTeamAccess.createResolver((0, _graphqlSubscriptions.withFilter)(() => _pubsub.default.asyncIterator(NEW_CHANNEL_MESSAGE), (payload, args) => payload.channelId === args.channelId))
    }
  },
  Message: {
    url: parent => parent.url ? `${process.env.SERVER_URL || 'http://localhost:8080'}/${parent.url}` : parent.url,
    user: ({
      user,
      userId
    }, args, {
      models
    }) => {
      if (user) {
        return user;
      }

      return models.User.findOne({
        where: {
          id: userId
        }
      }, {
        raw: true
      });
    }
  },
  Query: {
    messages: _permissions.default.createResolver(async (parent, {
      cursor,
      channelId
    }, {
      models,
      user
    }) => {
      const channel = await models.Channel.findOne({
        raw: true,
        where: {
          id: channelId
        }
      });

      if (!channel.public) {
        const member = await models.PCMember.findOne({
          raw: true,
          where: {
            channelId,
            userId: user.id
          }
        });

        if (!member) {
          throw new Error('Not Authorized');
        }
      }

      const options = {
        order: [['created_at', 'DESC']],
        where: {
          channelId
        },
        limit: 35
      };

      if (cursor) {
        options.where.created_at = {
          [models.op.lt]: cursor
        };
      }

      return models.Message.findAll(options, {
        raw: true
      });
    })
  },
  Mutation: {
    createMessage: _permissions.default.createResolver(async (parent, _ref, {
      models,
      user
    }) => {
      let {
        file
      } = _ref,
          args = _objectWithoutProperties(_ref, ["file"]);

      try {
        const messageData = args;

        if (file) {
          messageData.filetype = file.type;
          messageData.url = file.path;
          messageData.filename = file.name;
        }

        const message = await models.Message.create(_objectSpread({}, messageData, {
          userId: user.id
        }));

        const asyncFunc = async () => {
          const currentUser = await models.User.findOne({
            where: {
              id: user.id
            }
          });

          _pubsub.default.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: _objectSpread({}, message.dataValues, {
              user: currentUser.dataValues
            })
          });
        };

        asyncFunc();
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    })
  }
};
exports.default = _default;