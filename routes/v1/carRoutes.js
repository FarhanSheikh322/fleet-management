const express = require("express");
const router = express.Router();
const CarController = require("../../controllers/carController");
const { authenticateAdmin } = require("../../middlewares/auth");

// Car routes
router.post("/addCar", CarController.addCar);
router.put("/updateCar/:id", CarController.updateCar);
router.get("/getCar/:id", CarController.getCar);
router.get("/getAllCars", CarController.getAllCars);
router.delete("/deleteCar/:id", CarController.deleteCar);

module.exports = router;
