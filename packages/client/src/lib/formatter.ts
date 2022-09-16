export {
  formatBudget,
  formatCarbonFootprint,
  formatPoints,
  formatProductionGw,
};

function formatBudget(value?: number) {
  return value?.toFixed(2) || "";
}

function formatCarbonFootprint(value?: number) {
  return value?.toFixed(2) || "";
}

function formatPoints(value?: number) {
  return value?.toFixed(0) || "";
}

function formatProductionGw(value?: number) {
  return value?.toFixed(0) || "";
}
