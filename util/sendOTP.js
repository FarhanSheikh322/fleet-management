const axios = require("axios");
const config = require("../config");

module.exports.sendLoginOtpDriver = async (phone, otp) => {
  try {
    const response = await axios.post("https://saudiconnect.api/send", {
      apiKey: config.saudiConnect.apiKey,
      sender: config.saudiConnect.sender,
      to: phone,
      message: `Your OTP is: ${otp}`,
    });
    return response.data;
  } catch (error) {
    throw new Error("OTP sending failed");
  }
};

module.exports.SendRideOtpConsumer = async (phone, otp) => {
  try {
    const response = await axios.post("https://saudiconnect.api/send", {
      apiKey: config.saudiConnect.apiKey,
      sender: config.saudiConnect.sender,
      to: phone,
      message: `Your OTP is: ${otp}`,
    });
    return response.data;
  } catch (error) {
    throw new Error("OTP sending failed");
  }
};
