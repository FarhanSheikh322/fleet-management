

const express = require("express");
const router = express.Router();
const carController = require("../controllers/fleetCarDetails");
const swaggerJSDoc = require("swagger-jsdoc");



// console.log('route');

router.get("/cars", carController.getAllCarDetails);

router.post("/cars", carController.createCarDetails);
router.get("/cars/:id", carController.getCarDetailsById);
router.put("/cars/:id", carController.updateCarDetailsById);
router.delete("/cars/:id", carController.deleteCarDetailsById);

module.exports = router;
