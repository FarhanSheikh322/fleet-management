const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const logger = require("morgan");
const config = require('./config');
// const { authLimiter } = require("./middlewares/rateLimiter");
// const apiAuth = require("./middlewares/apiAuth");
// const toCamelCase = require("./utils/camelCase");
const _ = require("lodash");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const ApplicationMonitoring = require('./monitoring');
const swaggerSetup = require("./util/swagger");
/********************************************************/
/***** Require Controllers *****/
/********************************************************/
// const v1Router = require("./routes/v1");
// const sabV1Router = require("./clients/sab-consumer/routes/v1");
// const eliteV1Router = require("./clients/elite-consumer/routes/v1");
// const tenantResolver = require("./middlewares/tenantResolver");

/********************************************************/
/***** Spawn Express App *****/
/********************************************************/
const app = express();
swaggerSetup(app);
app.set("trust proxy", true);
let monitoring = null;
switch (config.app.env) {
  case "dev":
    monitoring = new ApplicationMonitoring(
      config.applicationInsightConfig.development.connectionString
    );
    monitoring.initialize();
    app.set("trust proxy", true);
    break;
  case "uat":
    monitoring = new ApplicationMonitoring(
      config.applicationInsightConfig.uat.connectionString
    );
    monitoring.initialize();
    app.set("trust proxy", true);
    break;
  case "prod":
    monitoring = new ApplicationMonitoring(
      config.applicationInsightConfig.production.connectionString
    );
    monitoring.initialize();
    app.set("trust proxy", true);
    break;
  default:
    break;
}

// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-tenant-id, x-api-key');
// 	next();
//   });

// app.use(cors({
// 	origin: '*',  // Replace '*' with specific domains in production for security, if needed.
// 	methods: 'GET,POST,PUT,DELETE,OPTIONS',
// 	allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-tenant-id, x-api-key'
// }));

/********************************************************/
/***** Load OpenAPI specification *****/
/********************************************************/
// const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));

// // Replace the placeholder with the actual base URL
// swaggerDocument.servers[0].url = `${config.app.baseUrl}/api/v1`;
// console.log("swagger is up and runnig: ", swaggerDocument.servers[0].url);

// /********************************************************/
// /***** Serve Swagger UI *****/
// /********************************************************/
// app.use('/api-docs', cors(), swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/********************************************************/
/***** Configure Middlewares *****/
/********************************************************/
app.use(compression());
app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Set the file size limit
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  })
);

/* Convert all response to camelCase */
app.use((req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    if (typeof data === "object") {
      data = toCamelCase(data);
    }
    originalSend.call(this, data);
  };

  next();
});

/********************************************************/
/***** Define Routes *****/
/********************************************************/



/* Catch 404 and forward to error handler */
app.use(function (req, res, next) {
  next(createError(404));
});

/********************************************************/
/***** General Error Handling *****/
/********************************************************/
app.use(function (err, req, res, next) {
  /* Set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = config.app.env !== "prod" ? err : {};

  /* Render the error page */
  res.status(err.status || 500);
  res.sendStatus(500);
});

module.exports = app;
