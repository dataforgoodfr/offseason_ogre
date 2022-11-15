export const buildChoices = (array: string[] | number[]) => {
  return array.map((value: string | number) => {
    return { value: value, description: value };
  });
};
