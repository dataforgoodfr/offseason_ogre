export const hasGameStarted = (status: string) => {
  if (["draft", "ready"].indexOf(status) > -1) {
    return false;
  }
  return true;
};
