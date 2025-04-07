const express = require("express");
const router = express.Router();

// Import all route modules
const carRoutes = require("./carRoutes");
const driverRoutes = require("./driverRoutes");
const firebaseNotiControllerRoute = require("./firebaseNotification.route")
// const rideRoutes = require("./rideRoutes");

// Mount routes
router.use("/cars", carRoutes);
router.use("/drivers", driverRoutes);
router.use("/notification",firebaseNotiControllerRoute)
// router.use("/rides", rideRoutes);

module.exports = router;
