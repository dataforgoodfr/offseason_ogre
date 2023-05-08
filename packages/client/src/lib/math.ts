import sum from "lodash/sum";

export { mean, orderOfMagnitude };

function mean(values: number[] | undefined): number {
  if (!values) return 0;
  return sum(values) / Math.max(values.length, 1);
}

/**
 * Compute the order of magnitude of a number.
 * @example
 * orderOfMagnitude(10) // 1
 * orderOfMagnitude(58746) // 4
 */
const orderOfMagnitude = (nb: number): number =>
  Math.floor(Math.log(nb) / Math.LN10 + 0.000000001);
