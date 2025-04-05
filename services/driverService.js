const db = require("../config/db");
const jwt = require("jsonwebtoken");
const saudiConnect = require("../utils/saudiConnect");

module.exports = {
  checkPhoneExists: async (contact_no) => {
    const [rows] = await db.execute(
      "SELECT id FROM driver_details WHERE contact_no = ?",
      [contact_no]
    );
    return rows.length > 0;
  },

  checkLicenseExists: async (license_no) => {
    const [rows] = await db.execute(
      "SELECT id FROM driver_details WHERE license_no = ?",
      [license_no]
    );
    return rows.length > 0;
  },

  sendOtp: async (contact_no, otp) => {
    await db.execute(
      "INSERT INTO otps (contact_no, otp, created_at) VALUES (?, ?, NOW())",
      [contact_no, otp]
    );
    return saudiConnect.sendOtp(contact_no, otp);
  },

  verifyOtp: async (contact_no, otp) => {
    const [rows] = await db.execute(
      "SELECT * FROM otps WHERE contact_no = ? AND otp = ? AND created_at >= NOW() - INTERVAL 5 MINUTE",
      [contact_no, otp]
    );
    return rows.length > 0;
  },

  registerDriver: async ({
    driver_name,
    contact_no,
    license_no,
    email,
    country_id,
    status,
  }) => {
    return db.execute(
      "INSERT INTO driver_details (driver_name, contact_no, license_no, email, country_id, status) VALUES (?, ?, ?, ?, ?, ?)",
      [driver_name, contact_no, license_no, email, country_id, status]
    );
  },

  verifyDriver: async (contact_no) => {
    const [rows] = await db.execute(
      "SELECT * FROM driver_details WHERE contact_no = ?",
      [contact_no]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  generateToken: (driver) => {
    return jwt.sign(
      {
        id: driver.id,
        contact_no: driver.contact_no,
        driver_name: driver.driver_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  },
};
