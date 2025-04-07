const express = require("express");
const router = express.Router();
const rideController = require('../../controllers/rideController');

router.post("/create", rideController.createRide);
router.get(
  "/by-consumer/:consumerId",
  rideController.getRideDetailsByConsumerId
);
router.get(
  "/by-transaction/:transactionId",
  rideController.getRideDetailsByTransactionId
);
router.get("/by-request/:requestId", rideController.getRideDetailsByRequestId);
router.get("/by-driver/:driverId", rideController.getRideDetailsByDriverId);
router.get("/by-car/:carId", rideController.getRideDetailsByCarId);

module.exports = router;
