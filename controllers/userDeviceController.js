const userDeviceService = require('../services/userDeviceService');
const httpStatus = require("http-status");

class UserDeviceController {
  // Register a new user device
  static async registerDevice(req, res) {
    try {
      const deviceDetails = req.body;
      const result = await userDeviceService.registerDevice(deviceDetails);
      res.status(httpStatus.CREATED).json({
        data: result,
        message: "Device registered successfully",
        status: httpStatus.CREATED,
      });
    } catch (error) {
      console.error("Device Registration Error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get all devices registered by a driver
  static async getDevicesByDriverId(req, res) {
    try {
      const { driverId } = req.params;
      const devices = await userDeviceService.getDevicesByDriverId(driverId);
      res.status(httpStatus.OK).json({
        data: devices,
        message: "Devices fetched successfully",
        status: httpStatus.OK,
      });
    } catch (error) {
      console.error("Get Devices Error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // Update device info by its ID
  static async updateDeviceById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updated = await userDeviceService.updateDeviceById(id, updateData);
      res.status(httpStatus.OK).json({
        data: updated,
        message: "Device updated successfully",
        status: httpStatus.OK,
      });
    } catch (error) {
      console.error("Update Device Error:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserDeviceController;
