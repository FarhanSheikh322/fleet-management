const carTypeService = require("../services/cartypesService.js");


class CarTypesController {

    static async getAllCarsTypes(req, res) {
        try {
            const { search = '', page = 0, size = 0, isActive = '' } = req.query;  // Default empty string for status and search, 0 for page and limit

            // Ensure that page and limit are numbers and handle invalid inputs
            const pageNumber = Number(page) >= 0 ? Number(page) : 0;  // Default to 0 if invalid
            const pageSize = Number(size) >= 0 ? Number(size) : 0;  // Default to 0 if invalid


            const carsTypes = await carTypeService.getAllCars(search, pageNumber, pageSize, isActive);


            res.json(carsTypes);
        } catch (error) {
            // Handle any errors
            res.status(500).json({ error: error.message });
        }
    }


}

module.exports = CarTypesController;
