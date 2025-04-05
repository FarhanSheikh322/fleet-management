const connection = require("../db/dbConnect");

class Car {
  static async add(carDetails) {
    const db = await connection.createConnection();
    const {
      car_reg_no,
      car_color,
      car_description,
      car_seats,
      car_boot_space,
    } = carDetails;
    const query = `
      INSERT INTO cars (car_reg_no, car_color, car_description, car_seats, car_boot_space, status)
      VALUES (?, ?, ?, ?, ?, 'available')
    `;
    const values = [
      car_reg_no,
      car_color,
      car_description,
      car_seats,
      car_boot_space,
    ];
    const [result] = await db.execute(query, values);
    db.close();
    return { ...carDetails, id: result.insertId, status: "available" };
  }

  static async update(carId, carDetails) {
    const db = await connection.createConnection();
    const {
      car_reg_no,
      car_color,
      car_description,
      car_seats,
      car_boot_space,
      status,
      car_model,
    } = carDetails;
    const query = `
      UPDATE cars 
      SET car_reg_no = ?, car_color = ?, car_description = ?, 
          car_seats = ?, car_boot_space = ?, status = ?, car_model = ?
      WHERE id = ? AND deleted_at IS NULL
    `;
    const values = [
      car_reg_no,
      car_color,
      car_description,
      car_seats,
      car_boot_space,
      status,
      car_model,
      carId,
    ];
    await db.execute(query, values);
    db.close();
    const [rows] = await db.execute("SELECT * FROM cars WHERE id = ?", [carId]);
    return rows[0];
  }

  static async getById(carId) {
    const db = await connection.createConnection();
    const [rows] = await db.execute(
      "SELECT * FROM cars WHERE id = ? AND deleted_at IS NULL",
      [carId]
    );
    db.close();
    return rows[0];
  }

  static async getAll(filters = {}, page = 1, limit = 10) {
    const db = await connection.createConnection();
    try {
      let query =
        "SELECT SQL_CALC_FOUND_ROWS * FROM cars WHERE deleted_at IS NULL";
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

      // Pagination - Ensure limit and offset are numbers
      const limitNum = parseInt(limit, 10);
      const offsetNum = parseInt((page - 1) * limit, 10);

      if (
        isNaN(limitNum) ||
        isNaN(offsetNum) ||
        limitNum <= 0 ||
        offsetNum < 0
      ) {
        throw new Error("Invalid pagination parameters");
      }

      query += " LIMIT ? OFFSET ?";
      values.push(limitNum, offsetNum);

      console.log("Executing SQL:", query, values); // Debugging Log

      // Execute query
      const [rows] = await db.query(query, values);
      const [[{ totalCount }]] = await db.execute(
        "SELECT FOUND_ROWS() AS totalCount"
      );

      return {
        cars: rows,
        totalCount,
      };
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch cars");
    } finally{
        db.close();
    }
  }

  static async delete(carId) {
    const db = await connection.createConnection();
    const query = `
      UPDATE cars 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND deleted_at IS NULL
    `;
    await db.execute(query, [carId]);
    const [rows] = await db.execute("SELECT * FROM cars WHERE id = ?", [carId]);
    db.close();
    return rows[0];
  }
}

module.exports = Car;
