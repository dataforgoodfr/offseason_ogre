import _ from "lodash";

export function sumFor<T extends { type: string; value: number }>(
  array: T[],
  type: string
) {
  return _.sumBy(
    array.filter(({ type: _type }) => _type === type),
    "value"
  ).toFixed(2);
}

export function sumAllValues<T extends { type: string; value: number }>(
  array: T[]
) {
  return _.sumBy(array, "value").toFixed(2);
}
