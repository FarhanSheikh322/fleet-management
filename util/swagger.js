const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fleet Management API",
      version: "1.0.0",
      description: "API documentation for Fleet Management System",
    },
    servers: [
      {
        url: "http://localhost:3000", // Update this with your actual URL
      },
    ],
  },
  apis: ["./routes/v1/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
