const driverService = require("../services/driverService");
const otpGenerator = require("../utils/otpGenerator");
const jwt = require("jsonwebtoken");

const sendOtp = async (req, res) => {
  try {
    const { phoneNumber, licenseNumber } = req.body;
    if (!phoneNumber || !licenseNumber) {
      return res
        .status(400)
        .json({ message: "Phone number and license are required" });
    }

    let driver = await driverService.getDriverByPhoneAndLicense(
      phoneNumber,
      licenseNumber
    );

    if (!driver) {
      // Register new driver after OTP verification
      console.log("New driver, OTP required for registration.");
    } else {
      console.log("Existing driver, OTP required for login.");
    }

    const otp = otpGenerator.generate();
    await driverService.saveOtp(phoneNumber, otp);

    // Send OTP via SMS (Saudi Connect API)
    console.log(`OTP sent: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully", phoneNumber });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, licenseNumber, otp } = req.body;
    if (!phoneNumber || !licenseNumber || !otp) {
      return res
        .status(400)
        .json({ message: "Phone, license, and OTP are required" });
    }

    const isValid = await driverService.verifyOtp(phoneNumber, otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await driverService.clearOtp(phoneNumber);

    let driver = await driverService.getDriverByPhoneAndLicense(
      phoneNumber,
      licenseNumber
    );

    if (!driver) {
      // Register driver after OTP verification
      driver = await driverService.createDriver(phoneNumber, licenseNumber);
    }

    const token = jwt.sign(
      { phoneNumber, licenseNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "OTP verified", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendOtp, verifyOtp };
