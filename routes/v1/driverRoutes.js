const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

router.post("/send-otp", driverController.sendOtp);
router.post("/verify-otp", driverController.verifyOtp);

module.exports = router;
