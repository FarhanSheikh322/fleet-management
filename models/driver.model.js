const connection = require("../db/dbConnect");

class Driver {
  static async register(driverDetails) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const { name, age, contact_no, license_no, license_image } =
        driverDetails;
      const query = `
        INSERT INTO drivers (name, age, contact_no, license_no, license_image, status)
        VALUES (?, ?, ?, ?, ?, 'available')
      `;
      const values = [name, age, contact_no, license_no, license_image];
      const [result] = await conn.execute(query, values);

      return { ...driverDetails, id: result.insertId, status: "available" };
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async checkContactExists(contact_no) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const [rows] = await conn.execute(
        "SELECT id FROM drivers WHERE contact_no = ?",
        [contact_no]
      );
      return rows.length > 0;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async checkLicenseExists(license_no) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const [rows] = await conn.execute(
        "SELECT id FROM drivers WHERE license_no = ?",
        [license_no]
      );
      return rows.length > 0;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async storeOTP(contact_no, otp, otp_type) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const expires_in = Date.now() + 5 * 60 * 1000; // 5 minutes
      const query = `
        INSERT INTO otp (contact_no, otp, otp_type, expires_in, created_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      await conn.execute(query, [
        contact_no,
        otp,
        otp_type,
        expires_in,
        Date.now(),
      ]);
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async storeLoginOTP(contact_no, otp, otp_type) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const expires_in = Date.now() + 5 * 60 * 1000; // 5 minutes
      const query = `
        INSERT INTO drivers (contact_no, otp, otp_type, expires_in, created_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      await conn.execute(query, [
        contact_no,
        otp,
        otp_type,
        expires_in,
        Date.now(),
      ]);
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async verifyOTP(contact_no, otp) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const currentTime = Date.now();
      const query = `
        SELECT * FROM otp 
        WHERE contact_no = ? AND otp = ? 
        AND expires_in > ? 
        ORDER BY created_at DESC LIMIT 1
      `;
      const [rows] = await conn.execute(query, [contact_no, otp, currentTime]);
      return rows.length > 0;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async verifyLoginOTP(contact_no, otp) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const currentTime = Date.now();
      const query = `
        SELECT * FROM otp 
        WHERE contact_no = ? AND otp = ? 
        AND expires_in > ? 
        ORDER BY created_at DESC LIMIT 1
      `;
      const [rows] = await conn.execute(query, [contact_no, otp, currentTime]);
      return rows.length > 0;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async getLastOTP(contact_no) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const query = `
        SELECT otp, expires_in FROM otp 
        WHERE contact_no = ? 
        ORDER BY created_at DESC LIMIT 1
      `;
      const [rows] = await conn.execute(query, [contact_no]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async getById(id) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();
      const [rows] = await conn.execute(
        "SELECT * FROM drivers WHERE id = ? AND deleted_at IS NULL",
        [id]
      );
      return rows[0];
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async getAll(status) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();
      let query = "SELECT * FROM drivers WHERE deleted_at IS NULL";
      const params = [];
      if (status) {
        query += " AND status = ?";
        params.push(status);
      }
      const [rows] = await conn.execute(query, params);
      return rows;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async updateById(id, data) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();
      const fields = [];
      const values = [];
      for (let key in data) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
      values.push(id);
      const query = `UPDATE drivers SET ${fields.join(", ")} WHERE id = ? AND deleted_at IS NULL`;
      const [result] = await conn.execute(query, values);
      return result.affectedRows;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async softDelete(id) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();
      const timestamp = Date.now();
      await conn.execute("UPDATE drivers SET deleted_at = ? WHERE id = ?", [
        timestamp,
        id,
      ]);
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = Driver;
