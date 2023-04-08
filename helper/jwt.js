const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { ACCESS_TOKEN, ACCESS_TOKEN_TTL, REFRESH_TOKEN, REFRESH_TOKEN_TTL } =
  process.env;
const jwtSignAccess = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
};
const jwtSignRefresh = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN, {
        expiresIn: REFRESH_TOKEN_TTL,
      });
};

const jwtVerify = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN); 
    } catch (error) {
        return false;
    }
}

module.exports = { jwtSignAccess, jwtSignRefresh, jwtVerify };
