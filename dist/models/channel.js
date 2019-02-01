"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (sequelize, DataTypes) => {
  const Channel = sequelize.define('channel', {
    name: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    dm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    passphrase_hint: {
      type: DataTypes.STRING
    },
    public_key: {
      type: DataTypes.STRING(2048) // unique: true,

    },
    private_key: {
      type: DataTypes.STRING(2048) // unique: true,

    },
    sig_public_key: {
      type: DataTypes.STRING(2048) // unique: true,

    },
    sig_private_key: {
      type: DataTypes.STRING(2048) // unique: true,

    }
  });

  Channel.associate = models => {
    Channel.belongsTo(models.Team, {
      foreignKey: {
        name: 'teamId',
        field: 'team_id'
      }
    });
    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    });
    Channel.belongsToMany(models.User, {
      through: models.PCMember,
      foreignKey: {
        name: 'channelId',
        field: 'channel_id'
      }
    });
  };

  return Channel;
};

exports.default = _default;