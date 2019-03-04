const debug = require('debug')('arcsa-api:user-router');
const express = require('express');
const UsersService = require('../../services/users');
const objResponse = require('../../utils/objResponse');

const router = express.Router();

const userService = new UsersService();

router.get('/', async function (req, res, next) {
  try {
    const users = await userService.getUsers();
    objResponse(res, 200, { data: users });
  } catch (err) {
    next(err);
  }
});

router.post('/', async function (req, res, next) {

});

router.put('/userId', async function (req, res, next) {

});

router.delete('/:userId', async function (req, res, next) {
  
})

module.exports = router;

