import { isObj } from "../../../../lib/object";

export { buildChoices, isNotEmpty };

function buildChoices(
  obj: Record<string, { value: string; description: string; order?: number }>
): { value: string; description: string }[];
function buildChoices(
  array: string[] | number[]
):
  | { value: string; description: string }[]
  | { value: number; description: number }[];
function buildChoices(
  arrayOrObj:
    | string[]
    | number[]
    | Record<string, { value: string; description: string; order?: number }>
) {
  if (isChoicesObject(arrayOrObj)) {
    return Object.values(arrayOrObj)
      .sort((itemA, itemB) => (itemA.order || 0) - (itemB.order || 0))
      .map((item) => ({
        value: item.value,
        description: item.description,
      }));
  }

  const sortedArray =
    typeof arrayOrObj[0] === "string" ? arrayOrObj.sort() : arrayOrObj;

  return sortedArray.map((value) => ({
    value,
    description: value,
  }));
}

const isChoicesObject = (
  arrayOrObj:
    | string[]
    | number[]
    | Record<string, { value: string; description: string }>
): arrayOrObj is Record<string, { value: string; description: string }> => {
  return isObj(arrayOrObj);
};

const isNotEmpty = (value: any) => {
  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    !Number.isNaN(value)
  );
};
