import { pointsValues } from "../constants";

export { computeBudgetPoints, computeCO2Points };

function computeBudgetPoints(budget: number) {
  if (budget <= pointsValues.BAD_BUDGET_MAX) {
    return pointsValues.BAD_BUDGET_POINTS;
  }
  if (
    budget > pointsValues.GOOD_BUDGET_MIN &&
    budget <= pointsValues.GOOD_BUDGET_MAX
  ) {
    return pointsValues.GOOD_BUDGET_POINTS;
  }
  return 0;
}

function computeCO2Points(carbonFootprint: number) {
  if (
    carbonFootprint > pointsValues.CO2_MIN &&
    carbonFootprint <= pointsValues.CO2_MAX
  ) {
    return pointsValues.CO2_POINTS;
  }
  return 0;
}
