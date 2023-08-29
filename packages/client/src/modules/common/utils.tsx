export { filterOutDuplicates, roundValue };

function roundValue(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function filterOutDuplicates(value: any, index: number, array: any[]) {
  return array.indexOf(value) === index;
}
