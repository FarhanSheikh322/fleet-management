const express = require("express");
const router = express.Router();
const DriverController = require("../../controllers/driverController"); // Ensure correct path



// Driver Signup & Login Routes
router.post("/sendSignOTP", DriverController.sendSignupOTP); // Send OTP for signup
router.post("/signUp", DriverController.verifySignUpOTP); // Verify OTP & register
router.post("/sendLoginOTP", DriverController.sendLoginOTP); // Send OTP for login
router.post("/verifyLogin", DriverController.verifyLoginOTP); // Verify login OTP

// Driver Crud
router.get('/:id', DriverController.getDriverById);
router.get('/', DriverController.getAllDrivers);
router.put('/:id', DriverController.updateDriverById);
router.delete('/:id', DriverController.deleteDriverById);

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
