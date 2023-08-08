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

function formatBudget(
  value?: number,
  { fractionDigits = 2 }: { fractionDigits?: number } = {}
) {
  return formatNumber(value, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
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
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatProductionGw(
  value?: number,
  { fractionDigits = 1 }: { fractionDigits?: number } = {}
) {
  return formatNumber(value, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
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

function formatProduction(
  value?: number,
  { fractionDigits = 2 }: { fractionDigits?: number } = {}
) {
  return formatNumber(value, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
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
