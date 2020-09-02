const jwt = require("jsonwebtoken");
const { jwtConfig } = require("./config");

const { secret, expiresIn } = jwtConfig;

const getUserToken = (user) => {
  // Don't store the user's hashed password
  // in the token data.
  const userDataForToken = {
    id: user.id,
    email: user.email,
  };

  // Create the token.
  const token = jwt.sign(
    { data: userDataForToken },
    secret,
    { expiresIn: parseInt(expiresIn, 10) } // 604,800 seconds = 1 week
  );

  return token;
};

module.exports = { getUserToken };
