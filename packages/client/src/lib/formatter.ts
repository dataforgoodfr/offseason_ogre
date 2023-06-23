import { userLocale } from "../modules/translations";

export {
  formatBudget,
  formatCarbonFootprint,
  formatConsumption,
  formatPercentage,
  formatPoints,
  formatProduction,
  formatProductionGw,
  formatResource,
  formatUserName,
};

function formatBudget(value?: number) {
  return value?.toFixed(2) || "";
}

function formatCarbonFootprint(
  value?: number,
  { fractionDigits = 2 }: { fractionDigits?: number } = {}
) {
  return formatNumber(value, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function formatPoints(value?: number) {
  return value?.toFixed(0) || "";
}

function formatProductionGw(value?: number) {
  return value?.toFixed(1) || "";
}

function formatConsumption(
  value: number,
  { fractionDigits = 0 }: { fractionDigits?: number } = {}
) {
  return formatNumber(value, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function formatPercentage(
  value?: number,
  { fractionDigits = 1 }: { fractionDigits?: number } = {}
) {
  return formatNumber(value, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
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

function formatResource({
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

function formatUserName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`;
}
