const driverService = require('../services/driverService');
const { validateDriverInput } = require('../util/validators');

class DriverController {
  static async selfSignup(req, res) {
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

  static async verifyOTP(req, res) {
    try {
      const { name, age, contact_no, license_no, license_image, status, otp } =
        req.body;

      // ✅ Verify OTP (Replace with actual validation)
      const isValidOTP = await driverService.verifyOTP(contact_no, otp);
      if (!isValidOTP) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // ✅ Check if driver exists
      let driver = await Driver.findOne({ where: { contact_no } });
      if (!driver) {
        driver = await Driver.create({
          name,
          age,
          contact_no,
          license_no,
          license_image,
          status,
        });
      }

      // ✅ Generate JWT Tokens
      const accessToken = jwt.sign(
        { id: driver.id, contact_no: driver.contact_no },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" } // Access token valid for 15 minutes
      );
      const refreshToken = jwt.sign(
        { id: driver.id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" } // Refresh token valid for 7 days
      );

      return res.status(201).json({
        message: "Signup successful",
        accessToken,
        refreshToken,
        driver: {
          id: driver.id,
          name: driver.name,
          contact_no: driver.contact_no,
          license_no: driver.license_no,
          status: driver.status,
        },
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async login(req, res) {
    try {
      const { contact_no } = req.body;
      const otp = await driverService.sendOTP(contact_no);
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
      res.json({ token });
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