const express = require("express");
const config = require("../../config");
const carRoute = require('./carRoutes');

const router = express.Router();

const appRoutes = [
  {
    path: 'carcontroller',
    route: carRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  //   {
  //     path: "/docs",
  //     route: docsRoute,
  //   },
];

appRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
