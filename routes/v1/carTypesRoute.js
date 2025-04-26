const express = require("express");
const router = express.Router();
const CarTypesController = require("../../controllers/carTypesController");


router.get("/", CarTypesController.getAllCarsTypes);


module.exports = router;