const connection = require("../db/dbConnect");
const config = require('../config');
const schemaName = config.app.schemaName;

class Car {
  static async add(carDetails) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const {
        car_reg_no,
        car_color,
        car_description,
        car_seats,
        car_boot_space,
        car_model,
      } = carDetails;

      const query = `
        INSERT INTO ${schemaName}.cars (car_reg_no, car_color, car_description, car_seats, car_boot_space, car_model, status)
        VALUES (?, ?, ?, ?, ?, ?, 'available')
      `;

      const values = [
        car_reg_no,
        car_color,
        car_description,
        car_seats,
        car_boot_space,
        car_model,
      ];

      const [result] = await conn.execute(query, values);

      return { ...carDetails, id: result.insertId, status: "available" };
    } catch (err) {
      console.error("Add Car Error:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  static async update(carId, carDetails) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const {
        car_reg_no,
        car_color,
        car_description,
        car_seats,
        car_boot_space,
        car_model,
        status,
      } = carDetails;

      const query = `
        UPDATE ${schemaName}.cars 
        SET car_reg_no = ?, car_color = ?, car_description = ?, 
            car_seats = ?, car_boot_space = ?, car_model = ?, status = ?
        WHERE id = ? AND deleted_at IS NULL
      `;

      const values = [
        car_reg_no,
        car_color,
        car_description,
        car_seats,
        car_boot_space,
        car_model,
        status,
        carId,
      ];

      await conn.execute(query, values);

      const [rows] = await conn.execute(
        `SELECT * FROM ${schemaName}.cars WHERE id = ?`,
        [carId]
      );
      return rows[0];
    } catch (err) {
      console.error("Update Car Error:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  static async getById(carId) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const [rows] = await conn.execute(
        `SELECT * FROM ${schemaName}.cars WHERE id = ? AND deleted_at IS NULL`,
        [carId]
      );

      return rows[0];
    } catch (err) {
      console.error("Get Car By ID Error:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  static async getAll(filters = {}, page = 1, limit = 10) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      let query =
        `SELECT SQL_CALC_FOUND_ROWS * FROM ${schemaName}.cars WHERE deleted_at IS NULL`;
      const values = [];

      if (filters.status) {
        query += " AND status = ?";
        values.push(filters.status);
      }

      if (filters.search) {
        query += " AND (car_reg_no LIKE ? OR car_description LIKE ?)";
        const searchTerm = `%${filters.search}%`;
        values.push(searchTerm, searchTerm);
      }

      const offset = (page - 1) * limit;
      query += " LIMIT ? OFFSET ?";
      values.push(parseInt(limit), parseInt(offset));

      const [rows] = await conn.execute(query, values);
      const [[{ totalCount }]] = await conn.execute(
        "SELECT FOUND_ROWS() AS totalCount"
      );

      return {
        cars: rows,
        totalCount,
      };
    } catch (err) {
      console.error("Get All Cars Error:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }

  static async delete(carId) {
    let conn;
    try {
      const pool = await connection();
      conn = await pool.getConnection();

      const query = `
        UPDATE ${schemaName}.cars 
        SET deleted_at = CURRENT_TIMESTAMP 
        WHERE id = ? AND deleted_at IS NULL
      `;
      await conn.execute(query, [carId]);

      const [rows] = await conn.execute(
        `SELECT * FROM ${schemaName}.cars WHERE id = ?`,
        [carId]
      );
      return rows[0];
    } catch (err) {
      console.error("Delete Car Error:", err);
      throw err;
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = Car;
