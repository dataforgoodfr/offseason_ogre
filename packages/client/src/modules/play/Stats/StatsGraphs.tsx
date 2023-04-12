import React from "react";
import {
  StackedEnergyBars,
  DetailsEnergyConsumptionBars,
  DetailsEnergyProductionBars,
  MaterialsBars,
} from "../../charts";
import { PlayBox } from "../Components";
import {
  EnergyConsumptionButtons,
  EnergyProductionButtons,
} from "../../common/components/EnergyButtons";
import { productionTypes, STEPS } from "../constants";
import _ from "lodash";
import { usePersona, usePlay } from "../context/playContext";
import { sumAllValues, sumForAndFormat } from "../../persona";
import { IGame } from "../../../utils/types";
import { formatMaterial } from "../../../lib/formatter";
import { MaterialsDatum } from "../gameEngines/materialsEngine";
import { Box } from "@mui/material";
import { ProductionStepDetails } from "./StatsGraphs.styles";

export { StatsGraphs };

function isNotFinishedStep(step: number, game: IGame) {
  return step > game.lastFinishedStep;
}

function StatsGraphs() {
  const [bar, setSelectedBar] = React.useState<number>();

  return (
    <PlayBox>
      <StackedEnergyBars
        data={useStackedEnergyData()}
        onClick={({ activeTooltipIndex }) => {
          setSelectedBar(activeTooltipIndex);
        }}
      />
      {<StepDetails bar={bar} />}
    </PlayBox>
  );
}

function StepDetails({ bar }: { bar: number | undefined }) {
  const { game } = usePlay();
  const { getPersonaAtStep } = usePersona();

  if (typeof bar === "undefined") return <></>;
  const step = bar === 0 || bar === 1 ? 0 : bar - 1;

  if (isNotFinishedStep(step, game)) return <></>;

  const persona = getPersonaAtStep(step);

  const materialsValues = Object.values(productionTypes).map(
    (prodType: string) => ({
      name: prodType,
      type: "materials",
      ...Object.assign(
        {},
        ...persona.materials
          .filter((mat: MaterialsDatum) => mat.type === prodType)
          .map((mat: MaterialsDatum) => ({
            [mat.name]: formatMaterial(mat.value) || 0,
          }))
      ),
    })
  );

  if (step === 0 && bar === 0) {
    return (
      <>
        <DetailsEnergyConsumptionBars persona={persona} />
        <EnergyConsumptionButtons persona={persona} />
      </>
    );
  } else if (step === 0 && bar === 1) {
    return (
      <>
        <ProductionStepDetails>
          <DetailsEnergyProductionBars persona={persona} />
          <MaterialsBars data={materialsValues} />
        </ProductionStepDetails>
        <EnergyProductionButtons persona={persona} />
      </>
    );
  } else if (STEPS[step]?.type === "consumption") {
    return (
      <>
        <DetailsEnergyConsumptionBars persona={persona} />
        <EnergyConsumptionButtons persona={persona} />
      </>
    );
  } else {
    return (
      <>
        <ProductionStepDetails>
          <DetailsEnergyProductionBars persona={persona} />
          <MaterialsBars data={materialsValues} />
        </ProductionStepDetails>
        <EnergyProductionButtons persona={persona} />
      </>
    );
  }
}

function useStackedEnergyData() {
  const { game } = usePlay();
  const { personaBySteps, getPersonaAtStep } = usePersona();

  const initialPersona = getPersonaAtStep(0);
  const initialValues = [
    {
      name: "Conso init",
      total: sumAllValues(initialPersona.consumption) || 0,
      fossil: sumForAndFormat(initialPersona.consumption, "fossil"),
      grey: sumForAndFormat(initialPersona.consumption, "grey"),
      mixte: sumForAndFormat(initialPersona.consumption, "mixte"),
      renewable: sumForAndFormat(initialPersona.consumption, "renewable"),
    },
    {
      name: "Prod init",
      total: sumAllValues(initialPersona.production) || 0,
      offshore: sumForAndFormat(initialPersona.production, "offshore"),
      nuclear: sumForAndFormat(initialPersona.production, "nuclear"),
      terrestrial: sumForAndFormat(initialPersona.production, "terrestrial"),
    },
  ];

  const stepsDetails = _.range(1, game.lastFinishedStep + 1).map(
    (step: number) => {
      const persona = personaBySteps[step];
      if (STEPS[step]?.type === "consumption") {
        return {
          name: step ? `Étape ${step}` : "Initial",
          total: sumAllValues(persona.consumption) || 0,
          fossil: sumForAndFormat(persona.consumption, "fossil"),
          grey: sumForAndFormat(persona.consumption, "grey"),
          mixte: sumForAndFormat(persona.consumption, "mixte"),
          renewable: sumForAndFormat(persona.consumption, "renewable"),
        };
      } else {
        return {
          name: step ? `Étape ${step}` : "Initial",
          total: sumAllValues(persona.production) || 0,
          offshore: sumForAndFormat(persona.production, "offshore"),
          nuclear: sumForAndFormat(persona.production, "nuclear"),
          terrestrial: sumForAndFormat(persona.production, "terrestrial"),
        };
      }
    }
  );
  return [...initialValues, ...stepsDetails];
}
