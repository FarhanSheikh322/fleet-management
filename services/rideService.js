const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const connection = require("../db/dbConnect");
const config = require("../config");
const { start } = require("applicationinsights");
const PRIOR_TO_PICKUP = config.app.priorToPickupTime;
const POST_DROP_TIME = config.app.postDropTime;
const RIDE_DURATION = config.app.rideDurationTime;

function generateTransactionId(consumerId) {
  const date = moment().format("DDMMYY");
  const uuidSegment = uuidv4()
    .replace(/[^0-9]/g, "")
    .slice(0, 4);
  return `${consumerId}-${date}-${uuidSegment}`;
}

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Haversine formula to calculate distance in KM
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (angle) => (angle * Math.PI) / 180;
  const R = 6371; // Radius of Earth in KM

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}

exports.createRide = async (rideData) => {
  const pool = await connection();
  const conn = await pool.getConnection();
  try {
    const {
      consumer_id,
      pickup_latitude,
      pickup_longitude,
      drop_latitude,
      drop_longitude,
      pickup_time,
      car_id,
      driver_id,
      request_id,
      consumer_number = null,
      pickup_location = null,
      drop_location = null,
    } = rideData;

    const pickupTime = new Date(pickup_time);

    // car driver should be mapped start will be before pickuptime and drop time will be 2hr to pickup time and end time will be after drop time
    const startTime = new Date(
      pickupTime.getTime() - PRIOR_TO_PICKUP * 60 * 1000
    );
    const dropTime = new Date(pickupTime.getTime() + RIDE_DURATION * 60 * 1000);
    const endTime = new Date(dropTime.getTime() + POST_DROP_TIME * 60 * 1000);

    const startMillis = startTime.getTime();
    const endMillis = endTime.getTime();

    console.log("startTime (ms):", startMillis);
    console.log("endTime (ms):", endMillis);

    console.log(
      "startTime :" + startTime,
      "dropTime :" + dropTime,
      "endTime :" + endTime
    );

    const distance_covered_km = calculateDistanceKm(
      pickup_latitude,
      pickup_longitude,
      drop_latitude,
      drop_longitude
    );

    const mapCarDriverSql = `INSERT INTO car_driver_map(car_id,driver_id,start_date_time,end_date_time)
  VALUES(?,?,?,?);`;

    const [mapped] = await conn.query(mapCarDriverSql, [
      car_id,
      driver_id,
      startMillis,
      endMillis,
    ]);
    const transaction_id = generateTransactionId(consumer_id);
    const ride_otp = generateOTP();
    // const created_datetime = moment.unix();
    const created_datetime = Date.now();

    const sql = `
    INSERT INTO consumer_ride_details (
      consumer_id, pickup_latitude, pickup_longitude,
      drop_latitude, drop_longitude, pickup_time, status,
      car_id, driver_id, request_id, distance_covered_km,
      ride_otp, created_datetime, transaction_id, consumer_number,
      pickup_location, drop_location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
      consumer_id,
      pickup_latitude,
      pickup_longitude,
      drop_latitude,
      drop_longitude,
      pickup_time,
      "assigned",
      car_id,
      driver_id,
      request_id,
      distance_covered_km,
      ride_otp,
      created_datetime,
      transaction_id,
      consumer_number,
      pickup_location,
      drop_location,
    ];

    const [result] = await conn.query(sql, values);

    return {
      id: result.insertId,
      transaction_id,
      ride_otp,
      distance_covered_km,
      status: "assigned",
    };
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

async function getConnectionAndQuery(sql, params) {
  const pool = await connection();
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(sql, params);
    return rows;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

exports.getRideDetailsByConsumerId = async (consumerId) => {
  const [data] = await getConnectionAndQuery(
    "SELECT * FROM consumer_ride_details WHERE consumer_id = ?",
    [consumerId]
  );
  return data;
};

exports.getRideDetailsByTransactionId = async (transactionId) => {
  const [data] = await getConnectionAndQuery(
    "SELECT * FROM consumer_ride_details WHERE transaction_id = ?",
    [transactionId]
  );
  return data;
};

exports.getRideDetailsByRequestId = async (requestId) => {
  const [data] = await getConnectionAndQuery(
    "SELECT * FROM consumer_ride_details WHERE request_id = ?",
    [requestId]
  );
  return data;
};

exports.getRideDetailsByDriverId = async (driverId) => {
  const [data] = await getConnectionAndQuery(
    "SELECT * FROM consumer_ride_details WHERE driver_id = ?",
    [driverId]
  );
  return data;
};

exports.getRideDetailsByCarId = async (carId) => {
  const [data] = await getConnectionAndQuery(
    "SELECT * FROM consumer_ride_details WHERE car_id = ?",
    [carId]
  );
  return data;
};