const driverService = require("../services/driverService");
const otpGenerator = require("otp-generator");

module.exports = {
  verifyDriverDetails: async (req, res) => {
    try {
      const { phone, license_number } = req.body;
      const isPhoneExists = await driverService.checkPhoneExists(phone);
      const isLicenseExists =
        await driverService.checkLicenseExists(license_number);

      if (isPhoneExists)
        return res
          .status(400)
          .json({ message: "Phone number already registered" });
      if (isLicenseExists)
        return res
          .status(400)
          .json({ message: "License number already registered" });

      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
      });
      await driverService.sendOtp(phone, otp);

      res.status(200).json({ message: "OTP sent for verification" });
    } catch (error) {
      res.status(500).json({ error: "Error verifying driver details" });
    }
  },
  registerDriver: async (req, res) => {
    try {
      const { name, phone, license_number, license_image } = req.body;
      const result = await driverService.registerDriver({
        name,
        phone,
        license_number,
        license_image,
      });
      res
        .status(201)
        .json({
          message: "Driver registered successfully",
          driverId: result[0].insertId,
        });
    } catch (error) {
      res.status(500).json({ error: "Error registering driver" });
    }
  },
  loginDriver: async (req, res) => {
    try {
      const { phone } = req.body;
      const driver = await driverService.verifyDriver(phone);
      if (!driver) return res.status(404).json({ message: "Driver not found" });

      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
      });
      await driverService.sendOtp(phone, otp);
      res.status(200).json({ message: "OTP sent" });
    } catch (error) {
      res.status(500).json({ error: "Error logging in" });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const { phone, otp } = req.body;
      const isOtpValid = await driverService.verifyOtp(phone, otp);
      if (!isOtpValid) return res.status(400).json({ message: "Invalid OTP" });

      const driver = await driverService.verifyDriver(phone);
      if (!driver) return res.status(404).json({ message: "Driver not found" });

      const token = driverService.generateToken(driver);
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ error: "Error verifying OTP" });
    }
  },
};
