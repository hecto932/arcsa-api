const bcrypt = require('bcrypt');

module.exports = async function encryptPassword(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword
  } catch (err) {
    next(err)
  }

  next();
}