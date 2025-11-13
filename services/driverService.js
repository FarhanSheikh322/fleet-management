const Driver = require("../models/driver.model");
const jwt = require("jsonwebtoken");
const { generateOTP, sendSMS } = require("../util/helpers");

class DriverService {
  static async checkDriverExists(contact_no, license_no) {
    try {
      const contactExists = await Driver.checkContactExists(contact_no);
      const licenseExists = await Driver.checkLicenseExists(license_no);
      return contactExists || licenseExists;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async sendSignUpOTP(contact_no) {
    const lastOTP = await Driver.getLastOTP(contact_no);
    if (lastOTP && lastOTP.expires_in > Date.now() - 60 * 1000) {
      return false;
    }

    const otp = generateOTP();
    await Driver.storeOTP(contact_no, otp, "registration");
    await sendSMS(contact_no, `Your OTP is: ${otp}`);
    return true;
  }
  static async sendLoginOTP(contact_no) {
    const otp = generateOTP();
    await Driver.storeLoginOTP(contact_no, otp, "login");
    await sendSMS(contact_no, `Your OTP is: ${otp}`);
    return true;
  }

  static async verifyOTP(contact_no, otp) {
    return await Driver.verifyOTP(contact_no, otp);
  }

  static async verifyLoginOTP(contact_no, otp) {
    return await Driver.verifyLoginOTP(contact_no, otp);
  }

  static async completeRegistration(driverDetails) {
    return await Driver.register(driverDetails);
  }

  static getDriverById(id) {
    return Driver.getById(id);
  }

  static getDriverByContact(contact) {
    return Driver.getByContact(contact);
  }

  static getAllDrivers(status) {
    return Driver.getAll(status);
  }

  static updateDriverById(id, data) {
    return Driver.updateById(id, data);
  }

  static softDeleteDriverById(id) {
    return Driver.softDelete(id);
  }

  static getUpcomingRidesForDriver(driverId) {
    return Driver.getUpcomingRidesForDriver(driverId);
  }

  static getUpcomingRidesForDriver(driverId) {
    return Driver.getOngoingRidesForDriver(driverId);
  }
}

module.exports = DriverService;

// const Driver = require('../models/driver.model');
// const jwt = require('jsonwebtoken');
// const { generateOTP, sendSMS } = require('../utils/helpers');

// class DriverService {
//   static async registerDriver(driverDetails) {
//     return await Driver.register(driverDetails);
//   }

//   static async checkDriverExists(contact_no, license_no) {
//     const contactExists = await Driver.checkContactExists(contact_no);
//     const licenseExists = await Driver.checkLicenseExists(license_no);
//     return contactExists || licenseExists;
//   }

//   static async sendOTP(contact_no) {
//     const otp = generateOTP();
//     await Driver.storeOTP(contact_no, otp,'registration');
//     await sendSMS(contact_no, `Your OTP is: ${otp}`);
//     return otp;
//   }

//   static async verifyOTP(contact_no, otp) {
//     return await Driver.verifyOTP(contact_no, otp);
//   }

//   static async completeRegistration(driverDetails) {
//     return await Driver.register(driverDetails);
//   }

//   static async verifyLoginOTP(contact_no, otp) {
//     const isValid = await Driver.verifyOTP(contact_no, otp);
//     if (!isValid) return null;

//     const driver = await Driver.getByContactNo(contact_no);
//     if (!driver) return null;

//     return jwt.sign(
//       { id: driver.id, contact_no: driver.contact_no },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );
//   }
// }

// module.exports = DriverService;
