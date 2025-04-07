const connection = require("../db/dbConnect");

class UserDevice {
  static async insert(deviceDetails) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();
  
      const {
        driver_id,
        device_name,
        device_id,
        device_model,
        token,
        status = "active",
        os_version,
        app_version,
        last_login,
        location,
        platform,
        device_unique_id,
        is_notification_allow = 0,
        created_at = Date.now(),
        updated_at = Date.now()
      } = deviceDetails;
  
      const hasLocation = location && location.lon && location.lat;
      const locationPoint = hasLocation
        ? `POINT(${location.lon} ${location.lat})`
        : null;
  
      const query = `
        INSERT INTO user_devices (
          driver_id, device_name, device_id, device_model, token, status,
          os_version, app_version, last_login, location, platform,
          device_unique_id, is_notification_allow, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ${hasLocation ? "ST_GeomFromText(?)" : "NULL"}, ?, ?, ?, ?, ?)
      `;
  
      const values = [
        driver_id,
        device_name,
        device_id,
        device_model,
        token,
        status,
        os_version,
        app_version,
        last_login,
      ];
  
      if (hasLocation) values.push(locationPoint);
  
      values.push(
        platform,
        device_unique_id,
        is_notification_allow,
        created_at,
        updated_at
      );
  
      const [result] = await conn.execute(query, values);
      return { id: result.insertId, ...deviceDetails };
    } catch (error) {
      console.log("Insert Error:", error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }
  

  static async getByDriverId(driver_id) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();
      const [rows] = await conn.execute(
        "SELECT * FROM user_devices WHERE driver_id = ?",
        [driver_id]
      );
      return rows;
    } catch (error) {
      console.log("Get Error:", error);
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
        if (key === "location" && data[key]?.lon && data[key]?.lat) {
          fields.push(`location = ST_GeomFromText(?)`);
          values.push(`POINT(${data[key].lon} ${data[key].lat})`);
        } else {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      }

      values.push(id);
      const query = `UPDATE user_devices SET ${fields.join(", ")} WHERE id = ?`;
      const [result] = await conn.execute(query, values);
      return result.affectedRows;
    } catch (error) {
      console.log("Update Error:", error);
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
        "SELECT * FROM user_devices WHERE id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      console.log("GetById Error:", error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  static async deleteById(id) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();
      const [result] = await conn.execute(
        "DELETE FROM user_devices WHERE id = ?",
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      console.log("Delete Error:", error);
      return null;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = UserDevice;
