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
import {
  getResultsByStep,
  usePlay,
  usePlayerActions,
} from "../context/playContext";
import { sumFor } from "../../persona";
import { PlayerActions } from "../../../utils/types";
import { getPlayerValuesByStep } from "../utils/playerValues";

export { StatsGraphs };

function StatsGraphs() {
  const [bar, setSelectedBar] = React.useState<number>();

  const { playerActions } = usePlayerActions();

  return (
    <PlayBox>
      <StackedEnergyBars
        data={useStackedEnergyData(playerActions)}
        onClick={({ activeTooltipIndex }) => {
          setSelectedBar(activeTooltipIndex);
        }}
      />
      {<StepDetails bar={bar} playerActions={playerActions} />}
    </PlayBox>
  );
}

function StepDetails({
  bar,
  playerActions,
}: {
  bar: number | undefined;
  playerActions: PlayerActions[];
}) {
  const { game } = usePlay();

  const personaByStep = getResultsByStep(playerActions);
  if (typeof bar === "undefined") return <></>;
  const step = bar === 0 || bar === 1 ? 0 : bar - 1;

  const persona = getPlayerValuesByStep(step, game, personaByStep);
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

function useStackedEnergyData(playerActions: PlayerActions[]) {
  const { game } = usePlay();

  const personaByStep = getResultsByStep(playerActions);
  const initialPersona = getPlayerValuesByStep(0, game, personaByStep);
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

  const stepsDetails = _.range(1, MAX_NUMBER_STEPS).map((step: number) => {
    if (step > game.step || (step === game.step && game.isStepActive)) {
      return {};
    }
    const persona = getPlayerValuesByStep(step, game, personaByStep);
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
        renewable: sumFor(persona.consumption, "renewable"),
        offshore: sumFor(initialPersona.production, "offshore"),
        terrestrial: sumFor(initialPersona.production, "terrestrial"),
      };
    }
  });
  return [...initialValues, ...stepsDetails];
}
