const jwt = require("jsonwebtoken");
const config = require("../config");

const getToken = async (sub, driver) => {
  const accessToken = jwt.sign({ sub, driver }, config.app.jwtSecret, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ sub, driver }, config.app.jwtSecret, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

// ✅ This is key!
module.exports = {
  getToken,
};
