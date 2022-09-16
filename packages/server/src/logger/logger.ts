/* eslint-disable no-console */
export { logger };

const logger = {
  log: (...args: any[]) => {
    console.log(...args);
  },
  info: (...args: any[]) => {
    console.log(...args);
  },
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
};
