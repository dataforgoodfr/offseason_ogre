import mergeDeep from "deepmerge";
import { isObject } from "lodash";

export { updateCollection };

function updateCollection<T extends Record<string, any>, U extends keyof T>(
  collection: T[],
  idField: U,
  updates: (Partial<T> & Pick<T, U>)[]
) {
  const idFieldToItemIdx = Object.fromEntries(
    collection.map((item, idx) => [item[idField], idx])
  );

  updates.forEach((update) => {
    const itemIdx = idFieldToItemIdx[update[idField]];
    if (itemIdx == null) {
      return;
    }

    const item = collection[itemIdx];
    collection.splice(itemIdx, 1, {
      ...(mergeDeep(item, update, {
        arrayMerge: mergeArrays,
      }) as T),
    });
  });

  return [...collection];
}

function mergeArrays<T extends Record<string, any>>(
  targetArray: T[] = [],
  sourceArray: T[] = []
) {
  if (doesArrayHoldsItemsWithId(targetArray)) {
    return updateCollection(targetArray, "id", sourceArray as any);
  }
  return sourceArray;
}

function doesArrayHoldsItemsWithId(
  arr: Record<string, any>[] | any[]
): arr is Record<string, any>[] {
  return !!arr.length && isObject(arr[0]) && (arr[0] as any)?.["id"] != null;
}
