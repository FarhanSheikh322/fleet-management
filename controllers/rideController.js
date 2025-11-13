const rideService = require("../services/rideService");

exports.createRide = async (req, res) => {
  try {
    const ride = await rideService.createRide(req.body);
    return res.status(201).json({ success: true, data: ride });
  } catch (error) {
    console.error("Create Ride Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRideDetailsByConsumerId = async (req, res) => {
  try {
    const data = await rideService.getRideDetailsByConsumerId(
      req.params.consumerId
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRideDetailsByTransactionId = async (req, res) => {
  try {
    const data = await rideService.getRideDetailsByTransactionId(
      req.params.transactionId
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRideDetailsByRequestId = async (req, res) => {
  try {
    const data = await rideService.getRideDetailsByRequestId(
      req.params.requestId
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRideDetailsByDriverId = async (req, res) => {
  try {
    const data = await rideService.getRideDetailsByDriverId(
      req.params.driverId
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRideDetailsByCarId = async (req, res) => {
  try {
    const data = await rideService.getRideDetailsByCarId(req.params.carId);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.startRide = async (req,res)=>{
  try {
    const {transactionId, otp} = req.body;
    const ride = await rideService.startRide(transactionId,otp);
    res.status(200).json({ success: true, ride });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: err.message });
  }
};