const jwt = require("jsonwebtoken");
const config = require("../config");
const drvierService = require('../services/driverService')


const getToken = async (sub, driver) => {
  const dbDriver = await drvierService.getDriverByContact(sub);
  const accessToken = jwt.sign({ sub, dbDriver }, config.app.jwtSecret, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ sub, dbDriver }, config.app.jwtSecret, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

// ✅ This is key!
module.exports = {
  getToken,
};
