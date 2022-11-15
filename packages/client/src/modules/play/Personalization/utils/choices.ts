export const buildChoices = (array: string[] | number[]) => {
  return array.sort().map((value: string | number) => {
    return { value: value, description: value };
  });
};
