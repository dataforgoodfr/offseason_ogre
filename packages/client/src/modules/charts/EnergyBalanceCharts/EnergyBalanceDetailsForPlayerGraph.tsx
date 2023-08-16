import React, { useMemo } from "react";
import { Persona } from "../../persona/persona";
import { useTranslation } from "../../translations/useTranslation";
import {
  DetailsEnergyConsumptionBars,
  DetailsEnergyProductionBars,
} from "../DetailsEnergyBars";
import {
  EnergyConsumptionButtons,
  EnergyProductionButtons,
} from "../../common/components/EnergyButtons";
import { StepDatum } from "./types";
import { getStackName } from "./utils";

export { EnergyBalanceDetailsForPlayerGraph };

function EnergyBalanceDetailsForPlayerGraph({
  stepDatum,
  getPersonaAtStep,
}: {
  stepDatum: StepDatum;
  getPersonaAtStep: (step: number) => Persona;
}) {
  const { t } = useTranslation();

  const DetailsContent = useMemo(() => {
    const persona = getPersonaAtStep(stepDatum.step);

    const graphTitle = t(
      "page.player.statistics.tabs.energy-balance.graphs.details.title",
      { stackName: getStackName({ stepDatum, t }) }
    );

    if (stepDatum.type === "consumption") {
      return (
        <>
          <DetailsEnergyConsumptionBars title={graphTitle} persona={persona} />
          <EnergyConsumptionButtons persona={persona} />
        </>
      );
    } else if (stepDatum.type === "production") {
      return (
        <>
          <DetailsEnergyProductionBars title={graphTitle} persona={persona} />
          <EnergyProductionButtons persona={persona} />
        </>
      );
    }
  }, [stepDatum, getPersonaAtStep, t]);

  return <>{DetailsContent}</>;
}
