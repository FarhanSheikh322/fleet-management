const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const carRoutes = require("./routes/v1/carRoutes");
const driverRoutes = require("./routes/v1/driverRoutes");
const rideRoutes = require("./routes/v1/rideRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/cars", carRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/rides", rideRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
