const express = require("express");
const driverController = require("../../controllers/driverController");
const router = express.Router();

router.post("/register", driverController.registerDriver);
router.post("/login", driverController.loginDriver);
router.post("/verify-otp", driverController.verifyOtp);

module.exports = router;