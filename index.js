const debug = require('debug')('arcsa-api:server');
const express = require('express');
const bodyParser = require('body-parser');

const usersApi = require('./routes/api/users');

const {
  logErrors,
  wrapErrors,
  clientErrorHandlers
} = require('./utils/middlewares/errorHandlers');

const app = express();
const port = process.env.PORT || 3000;

// third-party middlewares
app.use(bodyParser.json());

// routes
app.use('/api/users', usersApi);

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandlers);

const server = app.listen(port, () => {
  debug(`Server listening on port http://localhost:${server.address().port}`);
})