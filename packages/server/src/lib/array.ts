export const getAddOrRemoveCount = <T>(arr: T[], refLength: number) => ({
  addCount: Math.max(refLength - arr.length, 0),
  removeCount: Math.max(arr.length - refLength, 0),
});
