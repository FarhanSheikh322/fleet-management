const carType = require("../models/carType.model");

class CarTypesService {

    static async getAllCars(search, pageNumber = 0, pageSize = 0, isActive = 1) {
        return await carType.getAll(search, pageNumber, pageSize, isActive);
    }

}

module.exports = CarTypesService;
