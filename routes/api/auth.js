const debug = require('debug')('arcsa-api:auth-router');
const express = require('express');
const passport = require('passport');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const api = express.Router();

const { config } = require('../../config');

// BASIC STRATEGY
require('../../utils/auth/strategies/basic');

api.post('/token', async function (req, res, next) {
  passport.authenticate('basic', function (error, user) {
    try {
      debug(error);
      debug(user);
      if (error || !user) {
        next(boom.unauthorized());
      }

      req.logIn(user, { session: false }, async function (error) {
        if (error) {
          next(error)
        }
        const payload = { sub: user.username, email: user.email };
        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '8h'
        });

        return res.status(200).json({ access_token: token });
      })
    } catch (err) {
      next(err);
    }
  })(req, res, next);
})

module.exports = api;