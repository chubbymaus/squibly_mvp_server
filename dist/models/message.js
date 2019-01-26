'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Message = sequelize.define('message', {
    text: DataTypes.STRING(2048),
    url: DataTypes.STRING,
    filetype: DataTypes.STRING,
    filename: DataTypes.STRING,
    session_key: DataTypes.STRING(2048),
    signature: DataTypes.STRING(2048)
  }, {
    indexes: [{
      fields: ['created_at']
    }]
  });

  Message.associate = function (models) {
    Message.belongsTo(models.Channel, {
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    });
    Message.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
  };

  return Message;
};