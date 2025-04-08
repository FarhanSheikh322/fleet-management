const express = require("express");
const router = express.Router();
const UserDeviceController = require("../../controllers/userDeviceController.js"); // Adjust path as needed

// Register a device
router.post("/register", UserDeviceController.registerDevice);

// Get all devices by driver ID
router.get("/driver/:driverId", UserDeviceController.getDevicesByDriverId);

// Update device info
router.put("/:id", UserDeviceController.updateDeviceById);

module.exports = router;
