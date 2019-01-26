import { withFilter } from 'graphql-subscriptions';

import requiresAuth, { directMessageSubscription } from '../permissions';
import pubsub from '../pubsub';

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE ';

export default {
  Subscription: {
    newDirectMessage: {
      subscribe: directMessageSubscription.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
        (payload, args, { user }) =>
          payload.teamId === args.teamId &&
            ((payload.senderId === user.id && payload.receiverId === args.userId) ||
              (payload.senderId === args.userId && payload.receiverId === user.id)),
      )),
    },
  },
  DirectMessage: {
    sender: ({ sender, senderId }, args, { models }) => {
      if (sender) {
        return sender;
      }

      return models.User.findOne({ where: { id: senderId } }, { raw: true });
    },
    receiver: ({ receiver, receiverId }, args, { models }) => {
      if (receiver) {
        return receiver;
      }

      return models.User.findOne({ where: { id: receiverId } }, { raw: true });
    },
  },
  Query: {
    directMessages: requiresAuth.createResolver(async (parent, { teamId, otherUserId }, { models, user }) =>
      models.DirectMessage.findAll(
        {
          order: [['created_at', 'ASC']],
          where: {
            teamId,
            [models.sequelize.Op.or]: [
              {
                [models.sequelize.Op.and]: [{ receiverId: otherUserId }, { senderId: user.id }],
              },
              {
                [models.sequelize.Op.and]: [{ receiverId: user.id }, { senderId: otherUserId }],
              },
            ],
          },
        },
        { raw: true },
      )),
  },
  Mutation: {
    createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const directMessage = await models.DirectMessage.create({
          ...args,
          senderId: user.id,
        });

        pubsub.publish(NEW_DIRECT_MESSAGE, {
          teamId: args.teamId,
          senderId: user.id,
          sender_name: args.sender_name,
          receiver_name: args.receiver_name,
          session_key: args.session_key,
          signature: args.signature,
          receiverId: args.receiverId,
          newDirectMessage: {
            ...directMessage.dataValues,
            sender: {
              username: user.username,
            },
          },
        });

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }),
  },
};
