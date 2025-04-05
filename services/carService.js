const Car = require("../models/car.model");

class CarService {
  static async addCar(carDetails) {
    console.log(carDetails);

    return await Car.add(carDetails);
  }

  static async updateCar(carId, carDetails) {
    return await Car.update(carId, carDetails);
  }

  static async getCarById(carId) {
    return await Car.getById(carId);
  }

  static async getAllCars(filters, page, limit) {
    return await Car.getAll(filters, page, limit);
  }

  static async deleteCar(carId) {
    return await Car.delete(carId);
  }
}

module.exports = CarService;
