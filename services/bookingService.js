const db = require("../db/dbConnect");

module.exports = {
  createRide: async (ride) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sql = `INSERT INTO rides (driver_id, car_id, pickup_location, dropoff_location, ride_status, scheduled_time, ride_otp) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await otpService.sendOtp(ride.consumer_phone, otp); // Send OTP to consumer
    return db.execute(sql, [
      ride.driver_id,
      ride.car_id,
      ride.pickup_location,
      ride.dropoff_location,
      "scheduled",
      ride.scheduled_time,
      otp,
    ]);
  },
  startRide: async (rideId, enteredOtp) => {
    const [rows] = await db.execute('SELECT ride_otp FROM rides WHERE id = ?', [rideId]);
    if (rows.length === 0) return { error: 'Ride not found' };
    if (rows[0].ride_otp !== enteredOtp) return { error: 'Invalid OTP' };
    await db.execute('UPDATE rides SET ride_status = "ongoing" WHERE id = ?', [rideId]);
    return { message: 'Ride started successfully' };
  },
  getDriverUpcomingRides: async (driverId) => {
    const [rows] = await db.execute(
      'SELECT * FROM rides WHERE driver_id = ? AND ride_status = "scheduled" ORDER BY scheduled_time ASC',
      [driverId]
    );
    return rows;
  },
  getDriverCompletedRides: async (driverId) => {
    const [rows] = await db.execute(
      'SELECT * FROM rides WHERE driver_id = ? AND ride_status = "completed" ORDER BY scheduled_time DESC',
      [driverId]
    );
    return rows;
  }
};
