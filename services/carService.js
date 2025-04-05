const createConnection = require('../db/dbConnect');
const moment = require("moment-timezone");


const getAllCarDetails = async (
  schemaName,
  page,
  size,
  search,
  status,
  country_id
) => {
  console.log('service');
  let connection;
  try {
    const pool = await createConnection();
    connection = await pool.getConnection();
    const offset = (page - 1) * size;

    let query = `
            SELECT cd.id as carId, cd.car_model, cd.car_seats, cd.car_reg_no, 
                   cd.car_description, cd.car_color, cd.status, cd.country_id,
                   ct.id as carTypeId, ct.car_type 
            FROM ${schemaName}.car_details cd
            JOIN ${schemaName}.car_types ct ON cd.car_type_id = ct.id
            WHERE cd.deleted_at IS NULL`;

    let countQuery = `SELECT COUNT(*) as total_count FROM ${schemaName}.car_details cd WHERE cd.deleted_at IS NULL`;
    let queryParams = [];

    if (search) {
      query += ` AND (cd.car_model LIKE ? OR cd.car_reg_no LIKE ?)`;
      countQuery += ` AND (cd.car_model LIKE ? OR cd.car_reg_no LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      query += ` AND cd.status = ?`;
      countQuery += ` AND cd.status = ?`;
      queryParams.push(status);
    }

    if (country_id) {
      query += ` AND cd.country_id = ?`;
      countQuery += ` AND cd.country_id = ?`;
      queryParams.push(country_id);
    }

    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(size, offset);
    console.log(query);
    

    const [results] = await connection.query(query, queryParams);
    const [countResult] = await connection.query(
      countQuery,
      queryParams.slice(0, -2)
    );
    const totalElements = countResult[0].total_count;

    return { carDetails: results, totalElements };
  }catch(error){
    console.log(error);
    return ;
  } finally {
    if (connection) connection.release();
  }
};

const createCarDetails = async (schemaName, carData) => {
  let connection;
  try {
    const pool = await createConnection();
    connection = await pool.getConnection();
    const {
      car_type_id,
      car_model,
      car_seats,
      car_reg_no,
      car_description,
      car_color,
      status,
      country_id,
    } = carData;

    const query = `
            INSERT INTO ${schemaName}.car_details 
            (car_type_id, car_model, car_seats, car_reg_no, car_description, car_color, status, country_id, deleted_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)`;

    const [result] = await connection.query(query, [
      car_type_id,
      car_model,
      car_seats,
      car_reg_no,
      car_description,
      car_color,
      status,
      country_id,
    ]);
    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

const getCarDetailsById = async (schemaName, id) => {
  let connection;
  try {
    const pool = await createConnection();
    connection = await pool.getConnection();
    const query = `
            SELECT cd.id as carId, cd.car_type_id, cd.car_model, cd.car_seats, 
                   cd.car_reg_no, cd.car_description, cd.car_color, cd.status, cd.country_id,
                   ct.car_type, ct.id as carTypeId
            FROM ${schemaName}.car_details cd
            JOIN ${schemaName}.car_types ct ON cd.car_type_id = ct.id
            WHERE cd.deleted_at IS NULL AND cd.id = ?`;

    const [results] = await connection.query(query, [id]);
    return results.length > 0 ? results[0] : null;
  } finally {
    if (connection) connection.release();
  }
};

const updateCarDetailsById = async (schemaName, carData, id) => {
  let connection;
  try {
    const pool = await createConnection();
    connection = await pool.getConnection();
    const query = `
            UPDATE ${schemaName}.car_details 
            SET car_type_id = ?, car_model = ?, car_seats = ?, car_reg_no = ?, 
                car_description = ?, car_color = ?, status = ?, country_id = ?
            WHERE id = ? AND deleted_at IS NULL`;

    const {
      car_type_id,
      car_model,
      car_seats,
      car_reg_no,
      car_description,
      car_color,
      status,
      country_id,
    } = carData;
    const [result] = await connection.query(query, [
      car_type_id,
      car_model,
      car_seats,
      car_reg_no,
      car_description,
      car_color,
      status,
      country_id,
      id,
    ]);
    return result.affectedRows > 0;
  } finally {
    if (connection) connection.release();
  }
};

const deleteCarDetailsById = async (schemaName, id) => {
  let connection;
  try {
    const pool = await createConnection();
    connection = await pool.getConnection();
    const currentTimeMillis = moment().unix();
    const query = `UPDATE ${schemaName}.car_details SET deleted_at = ? WHERE id = ?`;
    const [result] = await connection.query(query, [currentTimeMillis, id]);
    return result.affectedRows > 0;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getAllCarDetails,
  createCarDetails,
  getCarDetailsById,
  updateCarDetailsById,
  deleteCarDetailsById,
};
