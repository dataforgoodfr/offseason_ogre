export const formatBooleanValue = (value: boolean) => {
  if (value === true) {
    return "Oui";
  } else if (value === false) {
    return "Non";
  }
};
