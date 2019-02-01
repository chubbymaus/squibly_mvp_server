"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "The first name can only contain letters"
        },
        len: {
          args: [2, 25],
          msg: "The first name needs to be between 2 and 25 characters long"
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "The last name can only contain letters"
        },
        len: {
          args: [2, 25],
          msg: "The last name needs to be between 2 and 25 characters long"
        }
      }
    },
    jobtitle: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 25],
          msg: "The job title needs to be between 3 and 25 characters long"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: "The username can only contain letters and numbers"
        },
        len: {
          args: [3, 25],
          msg: "The username needs to be between 3 and 25 characters long"
        }
      }
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

    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: 'The password needs to be between 5 and 100 characters long'
        }
      }
    }
  }, {
    hooks: {
      afterValidate: async user => {
        const hashedPassword = await _bcrypt.default.hash(user.password, 12); // eslint-disable-next-line no-param-reassign

        user.password = hashedPassword;
      }
    }
  });

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: models.Member,
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
    User.belongsToMany(models.Channel, {
      through: "channel_member",
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
    User.belongsToMany(models.Channel, {
      through: models.PCMember,
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
  };

  return User;
};

exports.default = _default;