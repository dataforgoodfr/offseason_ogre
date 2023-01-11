export const buildChoices = (array: string[] | number[]) => {
  const sortedArray = typeof array[0] === "string" ? array.sort() : array;
  return sortedArray.map((value: string | number) => {
    return { value: value, description: value };
  });
};

export const isNotEmpty = (value: any) => {
  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    !Number.isNaN(value)
  );
};
