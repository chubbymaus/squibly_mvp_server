"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _apolloServerExpress = require("apollo-server-express");

var _graphqlTools = require("graphql-tools");

var _path = _interopRequireDefault(require("path"));

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _cors = _interopRequireDefault(require("cors"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _http = require("http");

var _graphql = require("graphql");

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _formidable = _interopRequireDefault(require("formidable"));

var _dataloader = _interopRequireDefault(require("dataloader"));

var _models = _interopRequireDefault(require("./models"));

var _auth = require("./auth");

var _batchFunctions = require("./batchFunctions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SECRET = "sdfacysdfasdfhfuhijbkwerjh";
const SECRET2 = "sdfacysdfasdasdfasdffverteroiyfhfuhijbkwerjh";
const typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, './schema')));
const resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path.default.join(__dirname, './resolvers')));
const schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs,
  resolvers
});
const app = (0, _express.default)();
app.use((0, _cors.default)('*'));

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      const {
        user
      } = _jsonwebtoken.default.verify(token, SECRET);

      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await (0, _auth.refreshTokens)(token, refreshToken, _models.default, SECRET, SECRET2);

      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }

      req.user = newTokens.user;
    }
  }

  next();
};

const uploadDir = 'files';

const fileMiddleware = (req, res, next) => {
  if (!req.is('multipart/form-data')) {
    return next();
  }

  const form = _formidable.default.IncomingForm({
    uploadDir
  });

  form.parse(req, (error, {
    operations
  }, files) => {
    if (error) {
      console.log(error);
    }

    const document = JSON.parse(operations);

    if (Object.keys(files).length) {
      const {
        file: {
          type,
          path: filePath,
          name
        }
      } = files;
      console.log(type);
      console.log(filePath);
      document.variables.file = {
        type,
        path: filePath,
        name
      };
    }

    req.body = document;
    next();
  });
};

app.use(addUser);
const graphqlEndpoint = '/graphql';
app.use(graphqlEndpoint, _bodyParser.default.json(), fileMiddleware, (0, _apolloServerExpress.graphqlExpress)(req => ({
  schema,
  context: {
    models: _models.default,
    user: req.user,
    SECRET,
    SECRET2,
    channelLoader: new _dataloader.default(ids => (0, _batchFunctions.channelBatcher)(ids, _models.default, req.user)),
    serverUrl: `${req.protocol}://${req.get('host')}`
  }
})));
app.use('/graphiql', (0, _apolloServerExpress.graphiqlExpress)({
  endpointURL: graphqlEndpoint,
  subscriptionsEndpoint: 'ws://localhost:8080/subscriptions'
}));
app.use('/files', _express.default.static('files'));
const server = (0, _http.createServer)(app);

_models.default.sequelize.sync({}).then(() => {
  server.listen(8080, () => {
    // eslint-disable-next-line no-new
    new _subscriptionsTransportWs.SubscriptionServer({
      execute: _graphql.execute,
      subscribe: _graphql.subscribe,
      schema,
      // eslint-disable-next-line
      onConnect: async ({
        token,
        refreshToken
      }, webSocket) => {
        if (token && refreshToken) {
          try {
            const {
              user
            } = _jsonwebtoken.default.verify(token, SECRET);

            return {
              models: _models.default,
              user
            };
          } catch (err) {
            const newTokens = await (0, _auth.refreshTokens)(token, refreshToken, _models.default, SECRET, SECRET2);
            return {
              models: _models.default,
              user: newTokens.user
            };
          }
        }

        return {
          models: _models.default
        };
      }
    }, {
      server,
      path: '/subscriptions'
    });
  });
  console.log('////////we good///////////');
});