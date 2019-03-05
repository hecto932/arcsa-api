const debug = require('debug')('arcsa-api:user-router');
const express = require('express');
const passport = require('passport');
const multerStorage = require('../../utils/multerStorage');
const UsersService = require('../../services/users');
const objResponse = require('../../utils/objResponse');
const validation = require('../../utils/middlewares/validationHandler');
const validateRole = require('../../utils/middlewares/validateRole');
const validateAvatar = require('../../utils/middlewares/validateAvatar');
const encryptPassword = require('../../utils/middlewares/encryptPassword');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../../uploads'))
//   },
//   filename: function (req, file, cb) {
//     debug(file);
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })

// const upload = multer({ storage });

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
    const page = query.page ? parseInt(query.page) : null;
    const skip = query.page ? (parseInt(query.page) - 1) * limit : 0;
    delete query.page;
    delete query.limit;
    const users = await userService.getUsers({ query, options, sort, limit, skip });
    objResponse(res, 200, { data: users, pageNumber: query.page });
  } catch (err) {
    next(err);
  }
});

router.get('/:userId', validation({ userId: userIdSchema }, 'params'), async function (req, res, next) {
  const { userId } = req.params;
  const projection = { projection: { password: 0, role: 0 } }

  try {
    const users = await userService.get({ userId, projection });
    objResponse(res, 200, { data: [users] });
  } catch (err) {
    next(err);
  }
});

router.post('/', validateAvatar, multerStorage('avatar'), validateRole, validation(createUserSchema), encryptPassword, async function (req, res, next) {
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

router.put('/:userId', validation({ userId: userIdSchema }, 'params'), passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  const { body: user } = req;
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

router.delete('/:userId', validation({ userId: userIdSchema }, 'params'), passport.authenticate('jwt', { session: false }), async function (req, res, next) {
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

router.post('/upload', multerStorage('avatar'), async function (req, res, next) {
  console.log(req.file);
  console.log(req.body);
  res.status(200).json(req.file);
});

module.exports = router;

