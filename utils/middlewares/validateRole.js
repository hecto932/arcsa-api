module.exports = function (req, res, next) {
  if(!req.body.role) {
    req.body.role = 'normal';
  }
  next();
}