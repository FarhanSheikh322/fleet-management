const express = require("express");
const rideController = require("../../controllers/rideController");
const router = express.Router();

router.post("/", rideController.createRide);
router.get("/upcoming/:driverId", rideController.getDriverUpcomingRides);
router.get("/completed/:driverId", rideController.getDriverCompletedRides);

module.exports = router;
