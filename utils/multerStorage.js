const debug = require('debug')('arcsa-api:multerStorage');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid-base62');

function initMulter() {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(req.body);
      debug(path.join(__dirname, '../uploads'));
      cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
      console.log(req.body);
      const ext = path.extname(file.originalname);
      filename = `${req.body.username}-${uuid.v4().substr(0, 10)}${ext}`
      req.body.avatar = `../../${filename}`;
      cb(null, filename)
    }
  });

  return multer({
    storage,
    fileFilter: function (req, file, callback) {
      const ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg') {
        return callback(new Error('Only images are allowed'))
      }
      callback(null, true)
    },
    limits: {
      fileSize: 1024 * 1024
    },
  });
}

function multerStorage (filename) {
  return initMulter().single(filename);
}

module.exports = multerStorage;