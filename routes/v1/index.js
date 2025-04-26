const express = require("express");
const router = express.Router();

// Import all route modules
const carRoutes = require("./carRoutes");
const driverRoutes = require("./driverRoutes");
const rideRoutes = require('./rideRoutes');
const carTypesRoute = require("./carTypesRoute");

// Mount routes
router.use("/cars", carRoutes);
router.use("/drivers", driverRoutes);
router.use("/rides", rideRoutes);
router.use("/car-types", carTypesRoute)

module.exports = router;
