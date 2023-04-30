import { userLocale } from "../modules/translations";

export {
  formatBudget,
  formatCarbonFootprint,
  formatPoints,
  formatProductionGw,
  formatMaterial,
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
  return value?.toFixed(1) || "";
}

function formatMaterial(value?: number) {
  return value != null
    ? new Intl.NumberFormat(userLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    : "";
}
