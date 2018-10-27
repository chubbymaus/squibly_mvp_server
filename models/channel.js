export default (sequelize, DataTypes) => {
  const Channel = sequelize.define('channel', {
    name: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    dm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    passphrase: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "The username can only contain letters and numbers"
        }
      }
    },
    publicKey: {
      type: DataTypes.JSON,
      // unique: true,

    },
    privateKey: {
      type: DataTypes.JSON,
      // unique: true,
    },
    sigPublicKey: {
      type: DataTypes.JSON,
      // unique: true,
    },
    sigPrivateKey: {
      type: DataTypes.JSON,
      // unique: true,
    },
  });

  Channel.associate = (models) => {
    Channel.belongsTo(models.Team, {
      foreignKey:
      {
        name: 'teamId',
        field: 'team_id',
      },
    });
    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey:
      {
        name: 'channelId',
        field: 'channel_id',
      },
    });
    Channel.belongsToMany(models.User, {
      through: models.PCMember,
      foreignKey: {
        name: 'channelId',
        field: 'channel_id',
      },
    });
  };

  return Channel;
};
