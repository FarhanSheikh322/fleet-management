const UserDevice = require("../models/userDevice.model");

class UserDeviceService {
  static async registerDevice(deviceDetails) {
    return await UserDevice.insert(deviceDetails);
  }

  static async getDevicesByDriverId(driverId) {
    return await UserDevice.getByDriverId(driverId);
  }

  static async updateDeviceById(id, data) {
    return await UserDevice.updateById(id, data);
  }
}

module.exports = UserDeviceService;
