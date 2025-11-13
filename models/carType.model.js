const connection = require("../db/dbConnect");
const config = require('../config');


// schema default_schema
const schemaName = 'default_schema'

class CarType {

    static async getAll(search, pageNumber = 0, pageSize = 0, isActive = 'true') {
        let conn;
        try {
            const pool = await connection();
            conn = await pool.getConnection();

            // Base query to fetch all car types
            let baseQuery = `SELECT * FROM ${schemaName}.car_types WHERE deleted_at IS NULL `;
            const values = [];

            // Apply search filter
            if (search) {
                baseQuery += "AND (car_type LIKE ? OR car_type_description LIKE ?)";
                const searchTerm = `%${search}%`;
                values.push(searchTerm, searchTerm);
            }

            // Apply isActive filter only if it's explicitly provided
            if (isActive === 'true') {
                baseQuery += " AND is_active = ?";
                values.push(1);
            } else if (isActive === 'false') {
                baseQuery += " AND is_active = ?";
                values.push(0);
                values.forEach((value) => console.log(value))
            }

            // Fetch all rows first (for total count)
            const [allRows] = await conn.query(baseQuery, values);
            const totalCount = allRows.length;

            let data = allRows; // Default to all rows

            // Apply pagination if pageNumber > 0 and pageSize > 0
            if (pageNumber > 0 && pageSize > 0) {
                const offset = (pageNumber - 1) * pageSize;
                const paginatedQuery = `${baseQuery} LIMIT ? OFFSET ?`;
                const paginatedValues = [...values, pageSize, offset];
                const [paginatedRows] = await conn.query(paginatedQuery, paginatedValues);
                data = paginatedRows;
            }

            return {
                totalCount,
                data
            };
        } catch (err) {
            console.error("Get All Car Types Error:", err);
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

module.exports = CarType
