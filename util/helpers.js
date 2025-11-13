// const twilio = require("twilio");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSMS = async (phoneNumber, message) => {
  // const client = twilio(
  //   process.env.TWILIO_ACCOUNT_SID,
  //   process.env.TWILIO_AUTH_TOKEN
  // );

  try {
    console.log(phoneNumber);
    console.log(message);
  } catch (error) {
    console.error("SMS sending failed:", error);
    throw new Error("Failed to send SMS");
  }
};

module.exports = {
  generateOTP,
  sendSMS,
};
