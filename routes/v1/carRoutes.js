const express = require("express");
const carController = require('../../controllers/carController');

const router = express.Router();

router.get("/", carController.getAllCarDetails);
// router.post("/", carController.addCar);

module.exports = router;
