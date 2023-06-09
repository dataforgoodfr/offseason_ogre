import mergeDeep from "deepmerge";

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
        arrayMerge: replaceMergedArray,
      }) as T),
    });
  });

  return [...collection];
}

function replaceMergedArray<T>(_: T[], sourceArray: T[]) {
  return sourceArray;
}
