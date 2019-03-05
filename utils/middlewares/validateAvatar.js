module.exports = function (req, res, next) {
  if(!req.body.avatar) {
    req.body.avatar = '../../default.png';
  }
  next();
}