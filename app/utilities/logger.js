const { createLogger, format: { combine, json, timestamp }, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    json(),
  ),
  transports: [new transports.File({ filename: "./logs/velomatchr.log" })]
});

if (process.env.NODE_ENV === "development") {
  logger.add(new transports.Console());
}

module.exports = logger;
