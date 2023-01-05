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
import { getPlayerValuesByStep } from "../utils/playerValues";
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
  const { personaBySteps } = usePersona();

  if (typeof bar === "undefined") return <></>;
  const step = bar === 0 || bar === 1 ? 0 : bar - 1;

  if (isNotFinishedStep(step, game)) return <></>;

  const persona = getPlayerValuesByStep(step, game, personaBySteps);
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
  const { personaBySteps } = usePersona();

  const initialPersona = getPlayerValuesByStep(0, game, personaBySteps);
  const initialValues = [
    {
      name: "Conso init",
      total: sumAllValues(initialPersona.consumption) || 0,
      renewable: sumFor(initialPersona.consumption, "renewable"),
      fossil: sumFor(initialPersona.consumption, "fossil"),
      mixte: sumFor(initialPersona.consumption, "mixte"),
      grey: sumFor(initialPersona.consumption, "grey"),
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
          renewable: sumFor(persona.consumption, "renewable"),
          fossil: sumFor(persona.consumption, "fossil"),
          mixte: sumFor(persona.consumption, "mixte"),
          grey: sumFor(persona.consumption, "grey"),
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
