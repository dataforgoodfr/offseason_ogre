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
import { MAX_NUMBER_STEPS, STEPS } from "../constants";
import _ from "lodash";
import { usePersona, usePlay } from "../context/playContext";
import { sumFor } from "../../persona";
import { getPlayerValuesByStep } from "../utils/playerValues";
import { IGame } from "../../../utils/types";

export { StatsGraphs };

function isNotFinishedStep(step: number, game: IGame) {
  return step > game.step || (step === game.step && game.isStepActive);
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
      name: "Initial",
      renewable: sumFor(initialPersona.consumption, "renewable"),
      fossil: sumFor(initialPersona.consumption, "fossil"),
      mixte: sumFor(initialPersona.consumption, "mixte"),
      grey: sumFor(initialPersona.consumption, "grey"),
    },
    {
      name: "Initial",
      offshore: sumFor(initialPersona.production, "offshore"),
      terrestrial: sumFor(initialPersona.production, "terrestrial"),
    },
  ];

  const stepsDetails = _.range(
    1,
    Math.min(game.step + 1, MAX_NUMBER_STEPS)
  ).map((step: number) => {
    if (isNotFinishedStep(step, game)) {
      return {};
    }
    const persona = personaBySteps[step];
    if (STEPS[step]?.type === "consumption") {
      return {
        name: step ? `Étape ${step}` : "Initial",
        renewable: sumFor(persona.consumption, "renewable"),
        fossil: sumFor(persona.consumption, "fossil"),
        mixte: sumFor(persona.consumption, "mixte"),
        grey: sumFor(persona.consumption, "grey"),
      };
    } else {
      return {
        name: step ? `Étape ${step}` : "Initial",
        offshore: sumFor(persona.production, "offshore"),
        terrestrial: sumFor(persona.production, "terrestrial"),
      };
    }
  });
  return [...initialValues, ...stepsDetails];
}
