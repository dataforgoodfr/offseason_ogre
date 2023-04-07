import React from "react";
import {
  StackedEnergyBars,
  DetailsEnergyConsumptionBars,
  DetailsEnergyProductionBars,
} from "../../charts";
import { PlayBox } from "../Components";
import {
  EnergyConsumptionButtons,
  EnergyProductionButtons,
} from "../../common/components/EnergyButtons";
import { STEPS } from "../constants";
import _ from "lodash";
import { usePersona, usePlay } from "../context/playContext";
import { sumAllValues, sumFor } from "../../persona";
import { IGame } from "../../../utils/types";

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
        <DetailsEnergyProductionBars persona={persona} />
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
        <DetailsEnergyProductionBars persona={persona} />
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
      fossil: sumFor(initialPersona.consumption, "fossil"),
      grey: sumFor(initialPersona.consumption, "grey"),
      mixte: sumFor(initialPersona.consumption, "mixte"),
      renewable: sumFor(initialPersona.consumption, "renewable"),
    },
    {
      name: "Prod init",
      total: sumAllValues(initialPersona.production) || 0,
      offshore: sumFor(initialPersona.production, "offshore"),
      nuclear: sumFor(initialPersona.production, "nuclear"),
      terrestrial: sumFor(initialPersona.production, "terrestrial"),
    },
  ];

  const stepsDetails = _.range(1, game.lastFinishedStep + 1).map(
    (step: number) => {
      const persona = personaBySteps[step];
      if (STEPS[step]?.type === "consumption") {
        return {
          name: step ? `Étape ${step}` : "Initial",
          total: sumAllValues(persona.consumption) || 0,
          fossil: sumFor(persona.consumption, "fossil"),
          grey: sumFor(persona.consumption, "grey"),
          mixte: sumFor(persona.consumption, "mixte"),
          renewable: sumFor(persona.consumption, "renewable"),
        };
      } else {
        return {
          name: step ? `Étape ${step}` : "Initial",
          total: sumAllValues(persona.production) || 0,
          offshore: sumFor(persona.production, "offshore"),
          nuclear: sumFor(persona.production, "nuclear"),
          terrestrial: sumFor(persona.production, "terrestrial"),
        };
      }
    }
  );
  return [...initialValues, ...stepsDetails];
}
