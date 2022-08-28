import React from "react";
import { StackedEnergyBars, DetailsEnergyBars } from "../../charts";
import { PlayBox } from "../Components";
import { EnergyButtons } from "../../common/components/EnergyButtons";
import { MAX_NUMBER_STEPS } from "../constants";
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
  const [step, setSelectedStep] = React.useState<number>();

  const { playerActions } = usePlayerActions();

  return (
    <PlayBox>
      <StackedEnergyBars
        data={useStackedEnergyData(playerActions)}
        onClick={({ activeTooltipIndex }) => {
          setSelectedStep(activeTooltipIndex);
        }}
      />
      {<StepDetails step={step} playerActions={playerActions} />}
    </PlayBox>
  );
}

function StepDetails({
  step,
  playerActions,
}: {
  step: number | undefined;
  playerActions: PlayerActions[];
}) {
  const { game } = usePlay();

  const personaByStep = getResultsByStep(playerActions);
  if (typeof step === "undefined") return <></>;
  const persona = getPlayerValuesByStep(step, game, personaByStep);
  return (
    <>
      <DetailsEnergyBars persona={persona} />
      <EnergyButtons persona={persona} />
    </>
  );
}

function useStackedEnergyData(playerActions: PlayerActions[]) {
  const { game } = usePlay();

  const personaByStep = getResultsByStep(playerActions);
  return _.range(0, MAX_NUMBER_STEPS).map((step: number) => {
    if (step > game.step || (step === game.step && game.isStepActive)) {
      return {};
    }
    const persona = getPlayerValuesByStep(step, game, personaByStep);
    return {
      name: step ? `Etape ${step}` : "Initial",
      renewable: sumFor(persona.consumption, "renewable"),
      fossil: sumFor(persona.consumption, "fossil"),
      mixte: sumFor(persona.consumption, "mixte"),
      grey: sumFor(persona.consumption, "grey"),
    };
  });
}
