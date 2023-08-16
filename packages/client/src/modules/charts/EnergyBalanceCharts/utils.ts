import { StackedBarsBar } from "../StackedBars";
import { Persona } from "../../persona/persona";
import { sumReducer } from "../../../lib/array";
import { filterOutDuplicates } from "../../common/utils";
import { I18nTranslateFunction } from "../../translations";
import { StepDatum } from "./types";

export {
  computeConsumptionBarsForPersona,
  computeProductionBarsForPersona,
  getStackName,
};

function computeConsumptionBarsForPersona({
  persona,
  t,
}: {
  persona: Persona;
  t: I18nTranslateFunction;
}): StackedBarsBar[] {
  const consumptionTypes = persona.consumption
    .map((consumption) => consumption.type)
    .filter(filterOutDuplicates)
    .sort()
    .reverse();

  const bars: StackedBarsBar[] = consumptionTypes.map((type) => ({
    key: type,
    label: t(`energy.${type}`),
    total: persona.consumption
      .filter((datum) => datum.type === type)
      .map((datum) => datum.value)
      .reduce(sumReducer, 0),
  }));

  return bars;
}

function computeProductionBarsForPersona({
  persona,
  t,
}: {
  persona: Persona;
  t: I18nTranslateFunction;
}): StackedBarsBar[] {
  const productionTypes = persona.productionDisplayed
    .map((production) => production.type)
    .filter(filterOutDuplicates)
    .sort()
    .reverse();

  const bars: StackedBarsBar[] = productionTypes.map((type) => ({
    key: type,
    label: t(`graph.energy.${type}`),
    total: persona.productionDisplayed
      .filter((datum) => datum.type === type)
      .map((datum) => datum.value)
      .reduce(sumReducer, 0),
  }));

  return bars;
}

function getStackName({
  stepDatum,
  t,
}: {
  stepDatum: StepDatum;
  t: I18nTranslateFunction;
}) {
  return stepDatum.step === 0
    ? stepDatum.type === "consumption"
      ? t("graph.step.first.consumption.name")
      : t("graph.step.first.production.name")
    : t("graph.step.other.name", { stepNumber: stepDatum.step });
}
