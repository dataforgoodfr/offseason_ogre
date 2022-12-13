export const hasGameStarted = (status: string) => {
  if (["draft", "ready"].includes(status)) {
    return false;
  }
  return true;
};
