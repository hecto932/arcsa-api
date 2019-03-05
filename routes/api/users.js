const debug = require('debug')('arcsa-api:user-router');
const express = require('express');
const passport = require('passport');
const boom = require('boom');
const UsersService = require('../../services/users');
const objResponse = require('../../utils/objResponse');
const validation = require('../../utils/middlewares/validationHandler');
const validateRole = require('../../utils/middlewares/validateRole');
const encryptPassword = require('../../utils/middlewares/encryptPassword');

const {
  userIdSchema,
  createUserSchema,
  updateUserSchema
} = require('../../utils/schemas/users');

require('../../utils/auth/strategies/jwt');

const router = express.Router();

const userService = new UsersService();

router.get('/', async function (req, res, next) {
  const { query } = req;
  const options = { projection: { password: 0, role: 0 } }
  const sort = {};
  const limit = 10;

  try {
    const skip = query.page ? (parseInt(query.page) - 1) * limit : 0;
    delete query.page;
    const users = await userService.getUsers({ query, options, sort, limit, skip });
    objResponse(res, 200, { data: users });
  } catch (err) {
    next(err);
  }
});

router.get('/:userId', validation({ userId: userIdSchema }, "params") ,async function (req, res, next) {
  const { userId } = req.params;
  const projection = { projection: { password: 0, role: 0 } }

  try {
    const users = await userService.get({ userId, projection });
    objResponse(res, 200, { data: [users] });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateRole, encryptPassword, validation(createUserSchema), async function (req, res, next) {
  const { body: user } = req;
  const projection = { projection: { password: 0, role: 0 } }
  
  try {
    const userId = await userService.createUser({ user });
    const newUser = await userService.get({ userId, projection });
    objResponse(res, 200, { data: [newUser] });
  } catch (err) {
    next(err);
  }
});

router.put('/:userId', validation({ userId: userIdSchema }, "params") , passport.authenticate("jwt", { session: false }), async function (req, res, next) {
  const { body:user } = req;
  const { userId } = req.params;
  const projection = { projection: { password: 0 } }

  try {
    const userUpdatedId = await userService.updateUser({ userId, user });
    const userUpdated = await userService.get({ userId: userUpdatedId, projection });
    objResponse(res, 200, { data: userUpdated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:userId', validation({ userId: userIdSchema }, "params"), passport.authenticate("jwt", { session: false }), async function (req, res, next) {
  const { userId } = req.params;

  try {
    const existUser = await userService.get({ userId });
    if (existUser) {
      const userDeletedId = await userService.deleteUser({ userId });
      objResponse(res, 200, { data: [{ _id: userDeletedId }] });
    } else {
      res.status(400).json({
        error: true,
        message: `${userId} does not exist...`,
        result: []
      })
    }

  } catch (err) {
    next(err);
  }
})

module.exports = router;

