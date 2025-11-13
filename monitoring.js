// monitoring.js
const appInsights = require("applicationinsights");

class ApplicationMonitoring {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  initialize() {
    appInsights
      .setup(this.connectionString)
      // Core settings
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setAutoCollectHeartbeat(true)
      // Additional performance settings
      //.setAutoCollectMemory(true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(true);
    // Sampling settings
    //.setSamplingPercentage(100);

    // Start Application Insights
    appInsights.start();

    // Add custom error handling
    this.setupErrorHandling();

    return appInsights;
  }

  setupErrorHandling() {
    process.on("uncaughtException", (err) => {
      appInsights.defaultClient.trackException({
        exception: err,
        properties: { type: "UncaughtException" },
      });
    });

    process.on("unhandledRejection", (reason) => {
      appInsights.defaultClient.trackException({
        exception: reason,
        properties: { type: "UnhandledRejection" },
      });
    });
  }
}

module.exports = ApplicationMonitoring;
