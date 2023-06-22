export { batchItems, getAddOrRemoveCount };

const batchItems = async <T>(
  arr: T[],
  batchSize: number,
  processor: (items: T[]) => Promise<void>
) => {
  let idx = 0;
  while (idx < arr.length) {
    const items = arr.slice(idx, idx + batchSize);
    // eslint-disable-next-line no-await-in-loop
    await processor(items);
    idx += batchSize;
  }
};

const getAddOrRemoveCount = <T>(arr: T[], refLength: number) => ({
  addCount: Math.max(refLength - arr.length, 0),
  removeCount: Math.max(arr.length - refLength, 0),
});
