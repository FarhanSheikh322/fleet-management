const driverService = require('../services/driverService');
const { validateDriverInput } = require('../util/validators');
const Driver = require('../models/driver.model');
const { getToken } = require('../util/generateToken');
const httpStatus = require("http-status");



class DriverController {
  static async sendSignupOTP(req, res) {
    try {
      const { contact_no, license_no } = req.body;
      const exists = await driverService.checkDriverExists(
        contact_no,
        license_no
      );
      if (exists) {
        return res.status(400).json({ error: "Driver already exists" });
      }

      const otpSent = await driverService.sendOTP(contact_no);
      if (!otpSent) {
        return res
          .status(429)
          .json({ error: "OTP already sent. Please wait." });
      }

      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async verifySignUpOTP(req, res) {
    try {
      const { name, age, contact_no, license_no, license_image, status, otp } =
        req.body;

      // ✅ Verify OTP
      const isValidOTP = await driverService.verifyOTP(contact_no, otp);
      if (!isValidOTP) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // ✅ Check if driver exists manually
      const exists = await driverService.checkDriverExists(
        contact_no,
        license_no
      );
      if (!exists) {
        await Driver.register({
          name,
          age,
          contact_no,
          license_no,
          license_image,
        });
      }

      // ✅ Issue tokens
      const tokenSub = contact_no;
      const { accessToken, refreshToken } = await getToken(tokenSub, {
        contact_no,
      });
      // console.log(accessToken, refreshToken);

      res.status(httpStatus.OK).send({
        responseBody: { accessToken, refreshToken },
        message: "Success",
        status: httpStatus.OK,
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async sendLoginOTP(req, res) {
    try {
      const { contact_no } = req.body;
      if (!contact_no) {
        return res.status(400).json({ message: "Invalid Number" });
      }
      const otp = await driverService.sendLoginOTP(contact_no);
      res.json({ message: "Login OTP sent successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async verifyLoginOTP(req, res) {
    try {
      const { contact_no, otp } = req.body;
      const token = await driverService.verifyLoginOTP(contact_no, otp);
      if (!token) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
      const tokenSub = contact_no;
      const { accessToken, refreshToken } = await getToken(tokenSub, {
        contact_no,
      });
      // console.log(accessToken, refreshToken);

      res.status(httpStatus.OK).send({
        responseBody: { accessToken, refreshToken },
        message: "Success",
        status: httpStatus.OK,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async verifyOTP(req, res) {
    try {
      const { contact_no, otp } = req.body;
      const isValid = await driverService.verifyOTP(contact_no, otp);

      if (!isValid) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
      return res.status(200).json({ message: "OTP Verified Successfully" });
    } catch (error) {
      console.error("OTP Verification Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // driver crud
  static async getDriverById(req, res) {
    try {
      const driverId = req.params.id;
      console.log(driverId);

      const driver = await driverService.getDriverById(driverId);
      if (!driver) {
        return res.status(200).json({ driver });
      }
      res.status(200).json({ driver });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getDriverByContact(req, res) {
    try {
      const contact = req.params.contact;
      console.log(contact);

      const driver = await driverService.getDriverByContact(contact);
      res.status(200).json({ driver });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getAllDrivers(req, res) {
    try {
      const { status } = req.query;
      const drivers = await driverService.getAllDrivers(status);
      res.json(drivers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateDriverById(req, res) {
    try {
      const updated = await driverService.updateDriverById(
        req.params.id,
        req.body
      );
      res.json({ success: true, updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteDriverById(req, res) {
    try {
      await driverService.softDeleteDriverById(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}


module.exports = DriverController;




// const driverService = require('../services/driverService');
// const { validateDriverInput } = require('../utils/validators');

// class DriverController {
//   static async registerDriver(req, res) {
//     try {
//       const { error } = validateDriverInput(req.body);
//       if (error) {
//         return res.status(400).json({ error: error.details[0].message });
//       }

//       const driver = await driverService.registerDriver(req.body);
//       res.status(201).json(driver);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   static async selfSignup(req, res) {
//     try {
//       // const { error } = validateDriverInput(req.body);
//       // if (error) {
//       //   return res.status(400).json({ error: error.details[0].message });
//       // }

//       const { contact_no, license_no } = req.body;
//       const exists = await driverService.checkDriverExists(contact_no, license_no);
//       if (exists) {
//         return res.status(400).json({ error: 'Driver already exists' });
//       }

//       const otp = await driverService.sendOTP(contact_no);
//       res.json({ message: 'OTP sent successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   static async verifyOTP(req, res) {
//     try {
//       const { contact_no, otp } = req.body;
//       const isValid = await driverService.verifyOTP(contact_no, otp);
//       if (!isValid) {
//         return res.status(400).json({ error: 'Invalid OTP' });
//       }
      
//       const driver = await driverService.completeRegistration(req.body);
//       res.status(201).json(driver);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   static async login(req, res) {
//     try {
//       const { contact_no } = req.body;
//       const otp = await driverService.sendOTP(contact_no);
//       res.json({ message: 'Login OTP sent successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   static async verifyLoginOTP(req, res) {
//     try {
//       const { contact_no, otp } = req.body;
//       const token = await driverService.verifyLoginOTP(contact_no, otp);
//       if (!token) {
//         return res.status(400).json({ error: 'Invalid OTP' });
//       }
//       res.json({ token });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// module.exports = DriverController;