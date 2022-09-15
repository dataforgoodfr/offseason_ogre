export { formatBudget, formatCarbonFootprint, formatProductionGw };

function formatBudget(value?: number) {
  return value?.toFixed(2) || "";
}

function formatCarbonFootprint(value?: number) {
  return value?.toFixed(2) || "";
}

function formatProductionGw(value?: number) {
  return value?.toFixed(0) || "";
}
