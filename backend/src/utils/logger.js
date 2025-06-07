const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",

  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    myFormat
  ),

  transports: [

    new transports.File({
      filename: "logs/app.log",
      level: "info",
      options: { flags: "w" }
    }),

    new transports.File({
      filename: "logs/error.log",
      level: "error",
      options: { flags: "w" }
    }),

    new transports.File({
      filename: "logs/warn.log",
      level: "warn",
      options: { flags: "w" }
    }),
  ],

  exitOnError: false,
});

logger.exceptions.handle(
  new transports.File({
    filename: "logs/exceptions.log",
    options: { flags: "w" }
})
);
logger.rejections.handle(
  new transports.File({
    filename: "logs/rejections.log",
    options: { flags: "w" }
})
);

module.exports = logger;