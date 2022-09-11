/* eslint-disable consistent-return */
export const safe = async <F extends () => any | Promise<any>>(
  fn: F,
  { errorMsg, logError }: { errorMsg?: string; logError?: boolean } = {}
): Promise<ReturnType<F> | void> => {
  try {
    const res = await fn();
    return res;
  } catch (err) {
    if (logError) {
      console.error(errorMsg || err);
    }
  }
};
