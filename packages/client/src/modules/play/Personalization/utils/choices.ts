export { buildChoices, isNotEmpty };

const buildChoices = (array: string[] | number[]) => {
  const sortedArray = typeof array[0] === "string" ? array.sort() : array;
  return sortedArray.map((value: string | number) => {
    return { value: value, description: value };
  });
};

const isNotEmpty = (value: any) => {
  return value !== null && value !== undefined && value !== "";
};
