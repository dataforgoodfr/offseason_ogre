import winston from "winston";

export { logger };

const isProd = process.env.NODE_ENV === "production";

const formats = [];
formats.push(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }));
if (isProd) {
  formats.push(winston.format.json());
} else {
  formats.push(winston.format.simple());
}

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: isProd ? "info" : "debug",
      format: winston.format.combine(...formats),
    }),
  ],
});

const logger = {
  log: (level: string, msg: any, meta?: any) => {
    winstonLogger.log(level, convertErrorToStack(msg), meta);
  },
  info: (msg: any, meta?: any) => {
    winstonLogger.info(msg, meta);
  },
  warn: (msg: any, meta?: any) => {
    winstonLogger.warn(msg, meta);
  },
  error: (msg: any, meta?: any) => {
    winstonLogger.error(convertErrorToStack(msg), meta);
  },
};

function convertErrorToStack(msg: any): any {
  return msg instanceof Error ? msg.stack : msg;
}
