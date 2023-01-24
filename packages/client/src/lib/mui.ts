export { findColumnOption };

/**
 * Helper to get the option of a single select in a data grid by value.
 * @example
 * // In a data grid when building a column of the `columns` prop
 * valueFormatter: ({ value, field, api }) => {
 *   const option = findColumnOption(api, field, value);
 *   return option.label;
 * }
 * @param api
 * @param field
 * @param value
 * @returns
 */
function findColumnOption<T>(
  api: any,
  field: string,
  value: T
): { value: T; label: string } | undefined {
  const colDef = api.getColumn(field);
  return colDef.valueOptions.find(
    ({ value: optionValue }: { value: any }) => value === optionValue
  );
}
