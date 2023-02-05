import RateLimit from "express-rate-limit";

const MAX_REQUEST_PER_MINUTE = 120;
const WINDOW_IN_MS = 1 * 60 * 1000;

export { limiter };

const limiter = new (RateLimit as any)({
  windowMs: WINDOW_IN_MS,
  max: MAX_REQUEST_PER_MINUTE,
});
