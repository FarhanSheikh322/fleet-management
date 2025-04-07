const carService = require("../services/carService");
const { validateCarInput } = require("../util/validators");

class CarController {
  static async addCar(req, res) {
    try {
      // const { error } = validateCarInput(req.body);
      // if (error) {
      //   return res.status(400).json({ error: error.details[0].message });
      // }

      const car = await carService.addCar(req.body);
      console.log(car);

      res.status(201).json(car);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCar(req, res) {
    try {
      // const { error } = validateCarInput(req.body);
      // if (error) {
      //   return res.status(400).json({ error: error.details[0].message });
      // }

      const car = await carService.updateCar(req.params.id, req.body);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      console.log(car);
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCar(req, res) {
    try {
      const car = await carService.getCarById(req.params.id);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllCars(req, res) {
    try {
      const { status, search, page = 1, limit = 10 } = req.query;
      const cars = await carService.getAllCars(
        { status, search },
        Number(page),
        Number(limit)
      ); // Pass them correctly
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteCar(req, res) {
    try {
      const car = await carService.deleteCar(req.params.id);
      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }
      res.json({ message: "Car deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CarController;
