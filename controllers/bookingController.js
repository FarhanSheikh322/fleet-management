const rideService = require("../services/rideService");

module.exports = {
  createRide: async (req, res) => {
    try {
      const {
        driver_id,
        car_id,
        pickup_location,
        dropoff_location,
        scheduled_time,
      } = req.body;
      const result = await rideService.createRide({
        driver_id,
        car_id,
        pickup_location,
        dropoff_location,
        scheduled_time,
      });
      res
        .status(201)
        .json({ message: "Ride created", rideId: result[0].insertId });
    } catch (error) {
      res.status(500).json({ error: "Error creating ride" });
    }
  },
  getDriverUpcomingRides: async (req, res) => {
    try {
      const { driverId } = req.params;
      const rides = await rideService.getDriverUpcomingRides(driverId);
      res.status(200).json(rides);
    } catch (error) {
      res.status(500).json({ error: "Error fetching upcoming rides" });
    }
  },
  getDriverCompletedRides: async (req, res) => {
    try {
      const { driverId } = req.params;
      const rides = await rideService.getDriverCompletedRides(driverId);
      res.status(200).json(rides);
    } catch (error) {
      res.status(500).json({ error: "Error fetching completed rides" });
    }
  },
};
