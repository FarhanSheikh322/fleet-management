const connection = require("../db/dbConnect");

class Driver {
  static async register(driverDetails) {
    const db = await connection.createConnection();
    const { name, age, contact_no, license_no, license_image } = driverDetails;
    const query = `
      INSERT INTO drivers (name, age, contact_no, license_no, license_image, status)
      VALUES (?, ?, ?, ?, ?, 'available')
    `;
    const values = [name, age, contact_no, license_no, license_image];
    const [result] = await db.execute(query, values);
    db.close();
    return { ...driverDetails, id: result.insertId, status: "available" };
  }

  static async checkContactExists(contact_no) {
    const db = await connection.createConnection();
    const [rows] = await db.execute(
      "SELECT id FROM drivers WHERE contact_no = ?",
      [contact_no]
    );
    db.close();
    return rows.length > 0;
  }

  static async checkLicenseExists(license_no) {
    const db = await connection.createConnection();
    const [rows] = await db.execute(
      "SELECT id FROM drivers WHERE license_no = ?",
      [license_no]
    );
    db.close();
    return rows.length > 0;
  }

  static async storeOTP(contact_no, otp, otp_type) {
    const db = await connection.createConnection();
    const expires_in = Date.now() + 5 * 60 * 1000; // 5 minutes
    const query = `
      INSERT INTO otp (contact_no, otp, otp_type, expires_in, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(query, [
      contact_no,
      otp,
      otp_type,
      expires_in,
      Date.now(),
    ]);
    db.close();
  }

  static async verifyOTP(contact_no, otp) {
    const db = await connection.createConnection();
    const currentTime = Date.now();
    console.log(currentTime);

    const query = `
      SELECT * FROM otp 
      WHERE contact_no = ? AND otp = ? 
      AND expires_in > ? 
      ORDER BY created_at DESC LIMIT 1
    `;
    const [rows] = await db.execute(query, [contact_no, otp, currentTime]);
    db.close();
    return rows.length > 0;
  }

  static async getLastOTP(contact_no) {
    const db = await connection.createConnection();
    const query = `
      SELECT otp, expires_in FROM otp 
      WHERE contact_no = ? 
      ORDER BY created_at DESC LIMIT 1
    `;
    const [rows] = await db.execute(query, [contact_no]);
    db.close();
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = Driver;

// const db = require('../config/db');

// class Driver {
//   static async register(driverDetails) {
//     const { name, age, contact_no, license_no, license_image } = driverDetails;
//     const query = `
//       INSERT INTO drivers (name, age, contact_no, license_no, license_image, status)
//       VALUES (?, ?, ?, ?, ?, 'available')
//     `;
//     const values = [name, age, contact_no, license_no, license_image];
//     const [result] = await db.execute(query, values);
//     return { ...driverDetails, id: result.insertId, status: "available" };
//   }

//   static async checkContactExists(contact_no) {
//     const [rows] = await db.execute(
//       "SELECT id FROM drivers WHERE contact_no = ?",
//       [contact_no]
//     );
//     return rows.length > 0;
//   }

//   static async checkLicenseExists(license_no) {
//     const [rows] = await db.execute(
//       "SELECT id FROM drivers WHERE license_no = ?",
//       [license_no]
//     );
//     return rows.length > 0;
//   }

//   static async storeOTP(contact_no, otp, otp_type) {
//     const expires_in = Date.now() + 5 * 60 * 1000;
//     const query = `
//       INSERT INTO otp (contact_no, otp, otp_type, expires_in, created_at)
//       VALUES (?, ?, ?, ?, ?)
//     `;
//     await db.execute(query, [
//       contact_no,
//       otp,
//       otp_type,
//       expires_in,
//       Date.now(),
//     ]);
//   }

//   static async verifyOTP(contact_no, otp) {
//     const currentTime = Date.now();
//     const query = `
//       SELECT * FROM otp
//       WHERE contact_no = ? AND otp = ?
//       AND expires_in > ?
//       ORDER BY created_at DESC LIMIT 1
//     `;
//     const [rows] = await db.execute(query, [contact_no, otp, currentTime]);
//     return rows.length > 0;
//   }

//   static async getByContactNo(contact_no) {
//     const [rows] = await db.execute(
//       "SELECT * FROM drivers WHERE contact_no = ? AND deleted_at IS NULL",
//       [contact_no]
//     );
//     return rows[0];
//   }
// }

// module.exports = Driver;
