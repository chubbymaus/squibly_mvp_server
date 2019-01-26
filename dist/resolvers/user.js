'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _auth = require('../auth');

var _formatErrors = require('../formatErrors');

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _permissions = require('../permissions');

var _permissions2 = _interopRequireDefault(_permissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  User: {
    teams: function teams(parent, args, _ref) {
      var models = _ref.models,
          user = _ref.user;
      return models.sequelize.query('select * from teams as team join members as member on team.id = member.team_id where member.user_id = ?', {
        replacements: [user.id],
        model: models.Team,
        raw: true
      });
    }
  },
  Query: {
    getUser: function getUser(parent, _ref2, _ref3) {
      var userId = _ref2.userId;
      var models = _ref3.models;
      return models.User.findOne({ where: { id: userId } });
    },
    getUserPublicKeys: function getUserPublicKeys(parent, _ref4, _ref5) {
      var userName = _ref4.userName;
      var models = _ref5.models;
      return models.User.findOne({ where: { username: userName } });
    },
    getUserPrivateKeys: function getUserPrivateKeys(parent, _ref6, _ref7) {
      var userName = _ref6.userName;
      var models = _ref7.models;
      return models.User.findOne({ where: { username: userName } });
    },
    allUsers: function allUsers(parent, args, _ref8) {
      var models = _ref8.models;
      return models.User.findAll();
    },
    me: _permissions2.default.createResolver(function (parent, args, _ref9) {
      var models = _ref9.models,
          user = _ref9.user;
      return models.User.findOne({
        where: {
          id: user.id
        }
      });
    })
  },
  Mutation: {
    login: function login(parent, _ref10, _ref11) {
      var email = _ref10.email,
          password = _ref10.password;
      var models = _ref11.models,
          SECRET = _ref11.SECRET,
          SECRET2 = _ref11.SECRET2;
      return (0, _auth.tryLogin)(email, password, models, SECRET, SECRET2);
    },
    register: function () {
      var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, args, _ref13) {
        var models = _ref13.models;
        var user;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return models.User.create(args);

              case 3:
                user = _context.sent;
                return _context.abrupt('return', {
                  ok: true,
                  user: user
                });

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);
                return _context.abrupt('return', {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context.t0, models)
                });

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined, [[0, 7]]);
      }));

      return function register(_x, _x2, _x3) {
        return _ref12.apply(this, arguments);
      };
    }()
  }
};