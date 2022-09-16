import { logger } from "../logger";

/* eslint-disable consistent-return */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safe = async <F extends () => any>(
  fn: F,
  { errorMsg, logError }: { errorMsg?: string; logError?: boolean } = {}
): Promise<ReturnType<F> | void> => {
  try {
    const res = await fn();
    return res;
  } catch (err) {
    if (logError) {
      logger.error(errorMsg || err);
    }
  }
};
