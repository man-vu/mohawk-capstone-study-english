const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkPassword = function(raw, hash) {
  return new Promise(function(resolve, reject) {
    bcrypt.compare(raw, hash, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

/**
 * Generate password hash and salt from raw password passed as first parameter and return them
 * @param {*} password
 */
const hashPasswordAsync = async (password) => {
  const saltRounds = 10;

  const passwordSalt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, passwordSalt);

  return { passwordHash, passwordSalt };
};

function cleanObject(obj) {
  for (let i = 0; i < obj.length; i++) {
    for (var propName in obj[i]) {
      if (obj[i][propName] === null || obj[i][propName] === undefined) {
        delete obj[i][propName];
      }
    }
  }

  return obj;
}

function imageFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

function getAvatarUrl(firstName) {
  const baseUrl = "default/"
  const firstCharacter = firstName.trim().charAt(0)

  return `${baseUrl}${firstCharacter}.svg`
}

module.exports = {
  checkPassword,
  hashPasswordAsync,
  cleanObject,
  imageFilter,
  getAvatarUrl
};
