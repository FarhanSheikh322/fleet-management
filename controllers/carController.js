const carService = require("../services/fleetCarDetails.service");

console.log('controller');

const getAllCarDetails = async (req, res) => {
  try {
    const { page = 1, size = 10, search = "" } = req.query;
    const schemaName = req.headers["x-schema-name"];
    const result = await carService.getAllCarDetails(
      schemaName,
      Number(page),
      Number(size),
      search
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createCarDetails = async (req, res) => {
  try {
    const schemaName = req.headers["x-schema-name"];
    const carId = await carService.createCarDetails(schemaName, req.body);
    res.status(201).json({ message: "Car details added successfully", carId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCarDetailsById = async (req, res) => {
  try {
    const schemaName = req.headers["x-schema-name"];
    const car = await carService.getCarDetailsById(schemaName, req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCarDetailsById = async (req, res) => {
  try {
    const schemaName = req.headers["x-schema-name"];
    const success = await carService.updateCarDetailsById(
      schemaName,
      req.body,
      req.params.id
    );
    if (!success)
      return res.status(404).json({ message: "Car not found or not updated" });
    res.status(200).json({ message: "Car details updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCarDetailsById = async (req, res) => {
  try {
    const schemaName = req.headers["x-schema-name"];
    const success = await carService.deleteCarDetailsById(
      schemaName,
      req.params.id
    );
    if (!success)
      return res
        .status(404)
        .json({ message: "Car not found or already deleted" });
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCarDetails,
  createCarDetails,
  getCarDetailsById,
  updateCarDetailsById,
  deleteCarDetailsById,
};
