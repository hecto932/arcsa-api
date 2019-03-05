const debug = require('debug')('arcsa-api:user-router');
const express = require('express');
const UsersService = require('../../services/users');
const objResponse = require('../../utils/objResponse');

const router = express.Router();

const userService = new UsersService();

router.get('/', async function (req, res, next) {
  const { query } = req;
  const projection = { projection: { password: 0 } }
  const sort = {};

  try {
    const users = await userService.getUsers({ query, projection });
    objResponse(res, 200, { data: users });
  } catch (err) {
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  const { body: user } = req;
  const projection = { projection: { password: 0 } }
  try {
    const userId = await userService.createUser({ user });
    debug(`created: ${userId}`);
    const newUser = await userService.get({ userId, projection });
    objResponse(res, 200, { data: [newUser] });
  } catch (err) {
    next(err);
  }
});

router.put('/:userId', async function (req, res, next) {
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

router.delete('/:userId', async function (req, res, next) {
  const { userId } = req.params;

  try {
    const userDeletedId = await userService.deleteUser({ userId });
    objResponse(res, 200, { data: [{ _id: userDeletedId }] });
  } catch (err) {
    next(err);
  }
})

module.exports = router;

