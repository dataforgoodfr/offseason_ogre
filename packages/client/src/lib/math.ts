import sum from "lodash/sum";

export { mean };

function mean(values: number[]): number {
  return sum(values) / Math.max(values.length, 1);
}
