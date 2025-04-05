const express = require("express");
const router = express.Router();
const DriverController = require("../../controllers/driverController"); // Ensure correct path

// Check if DriverController is undefined
if (!DriverController) {
  throw new Error("DriverController is not defined or not imported correctly.");
}

// Driver Signup & Login Routes
router.post("/sendOTP", DriverController.selfSignup); // Send OTP for signup
router.post("/signUp", DriverController.verifyOTP); // Verify OTP & register
router.post("/login", DriverController.login); // Send OTP for login
router.post("/verifyLogin", DriverController.verifyLoginOTP); // Verify login OTP

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const DriverController = require("../../controllers/driverController");
// const { authenticateAdmin } = require("../../middlewares/auth");

// // Driver routes
// router.post("/register",  DriverController.registerDriver);
// router.post("/sendOTP", DriverController.selfSignup);
// router.post("/signUp", DriverController.verifyOTP);
// router.post("/login", DriverController.login);
// router.post("/verifyLogin", DriverController.verifyLoginOTP);

// module.exports = router;
