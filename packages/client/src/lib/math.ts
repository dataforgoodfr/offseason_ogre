import sum from "lodash/sum";

export { mean };

function mean(values: number[] | undefined): number {
  if (!values) return 0;
  return sum(values) / Math.max(values.length, 1);
}
