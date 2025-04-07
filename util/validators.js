const Joi = require("joi");

const validateCarInput = (data) => {
  const schema = Joi.object({
    car_reg_no: Joi.string().required(),
    car_color: Joi.string().required(),
    car_description: Joi.string().allow(""),
    car_seats: Joi.number().required(),
    car_boot_space: Joi.string(),
    status: Joi.string().valid("available", "on_ride", "maintenance"),
  });

  return schema.validate(data);
};

const validateDriverInput = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().min(18).required(),
    contact_no: Joi.string().required(),
    license_no: Joi.string().required(),
  });

  return schema.validate(data);
};

const validateRideInput = (data) => {
  const schema = Joi.object({
    car_id: Joi.number().required(),
    driver_id: Joi.number().required(),
    pickup_location: Joi.string().required(),
    pickup_lat: Joi.number().required(),
    pickup_long: Joi.number().required(),
    drop_location: Joi.string().required(),
    drop_lat: Joi.number().required(),
    drop_long: Joi.number().required(),
    booking_contact: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = {
  validateCarInput,
  validateDriverInput,
  validateRideInput,
};
