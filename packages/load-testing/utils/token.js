const jwt = require("jsonwebtoken");

module.exports = {
  sign,
};

function sign(secretKey, { payload, expiresIn }) {
  return jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn,
  });
}
