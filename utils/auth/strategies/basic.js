const debug = require('debug')('arcsa-api:basic-strategy');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('boom');
const bcrypt = require('bcrypt');
const MongoLib = require('../../../lib/mongo');

passport.use(
  new BasicStrategy(async function (username, password, cb) {
    const mongoDB = new MongoLib();

    try {
      const [user] = await mongoDB.getAll('users', { username });
      debug(user);

      if (!user) {
        return cb(boom.unauthorized(), false);
      }
      debug(password, user.password);
      if (!(await bcrypt.compare(password, user.password))) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);