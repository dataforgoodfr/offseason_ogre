export function roundValue(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
