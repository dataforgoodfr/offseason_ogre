import { sum } from "lodash";
import { getValueByName, sumAllValues } from "../../persona";
import { ConsumptionDatum } from "../../persona/consumption";
import { ProductionDatum } from "../../persona/production";
import { productionConstants } from "../constants";

export { computeCarbonProductionElectricMix, computeCarbonFootprint };

function computeCarbonProductionElectricMix(production: ProductionDatum[]) {
  const globalProduction = parseFloat(sumAllValues(production));
  return (
    sum(
      Object.values(productionConstants).map(
        ({ name, electricMixCarbonProduction }) =>
          getValueByName(production, name) * electricMixCarbonProduction
      )
    ) / globalProduction
  );
}

function computeCarbonFootprint(
  carbonProductionElectricMix: number,
  consumption: ConsumptionDatum[]
) {
  return sum(
    consumption.map(({ value, carbonProduction, carbonProductionPerKwh }) => {
      if (carbonProduction === "electric") {
        return (carbonProductionElectricMix * value) / 1000;
      }
      return ((carbonProductionPerKwh || 0) * value) / 1000;
    })
  );
}
