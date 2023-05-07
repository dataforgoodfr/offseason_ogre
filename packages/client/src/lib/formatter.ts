import { userLocale } from "../modules/translations";

export {
  formatBudget,
  formatCarbonFootprint,
  formatPoints,
  formatProduction,
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

function formatProduction({
  fractionDigits = 2,
}: { fractionDigits?: number } = {}) {
  return function (value?: number) {
    return formatNumber(value, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  };
}

function formatMaterial({
  fractionDigits = 2,
}: { fractionDigits?: number } = {}) {
  return function (value?: number) {
    return formatNumber(value, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  };
}

function formatNumber(value?: number, options: Intl.NumberFormatOptions = {}) {
  return value != null
    ? new Intl.NumberFormat(userLocale, options).format(value)
    : "";
}
