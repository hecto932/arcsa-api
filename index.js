const debug = require('debug')('arcsa-api:server');
const express = require('express');

const usersApi = require('./routes/api/users');

const app = express();
const port = process.env.PORT || 3000;

app.use('/api/users', usersApi);

const server = app.listen(port, () => {
  debug(`Server listening on port http://localhost:${server.address().port}`);
})