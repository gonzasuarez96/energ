const { Users } = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const refreshToken = async (cookies) => {
  if (!cookies?.jwt) {
    const error = new Error("Missing cookies or no jwt.");
    error.status = 401;
    throw error;
  };
  console.log(cookies);
  const refreshToken = cookies.jwt;
  let accessToken;
  const foundUser = await Users.findOne({ where: { refreshToken: refreshToken } });
  if (!foundUser) {
    const error = new Error("No user found with that refresh token.");
    error.status = 403;
    throw error;
  };
  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        const error = new Error(err.message);
        error.status = 403;
        throw error;
      };
      if (foundUser.email !== decoded.email) {
        const error = new Error("Payload doesn't match.");
        error.status = 403;
        throw error;
      };
      accessToken = jwt.sign(
        { email: decoded.email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: 30 }
      );
    }
  );
  return accessToken;
};

module.exports = { refreshToken }