import React from "react";
import { StackedEnergyBars, DetailsEnergyBars } from "../../charts";
import { PlayBox } from "../Components";
import { EnergyButtons } from "../../common/components/EnergyButtons";
import { MAX_NUMBER_STEPS } from "../constants";
import _ from "lodash";
import { usePersona, usePlay } from "../context/playContext";
import { sumFor } from "../../persona";
import { getPlayerValuesByStep } from "../utils/playerValues";

export { StatsGraphs };

function StatsGraphs() {
  const [step, setSelectedStep] = React.useState<number>();

  return (
    <PlayBox>
      <StackedEnergyBars
        data={useStackedEnergyData()}
        onClick={({ activeTooltipIndex }) => {
          setSelectedStep(activeTooltipIndex);
        }}
      />
      {<StepDetails step={step} />}
    </PlayBox>
  );
}

function StepDetails({ step }: { step: number | undefined }) {
  const { game } = usePlay();
  const { personaBySteps } = usePersona();

  if (typeof step === "undefined") return <></>;
  const persona = getPlayerValuesByStep(step, game, personaBySteps);
  return (
    <>
      <DetailsEnergyBars persona={persona} />
      <EnergyButtons persona={persona} />
    </>
  );
}

function useStackedEnergyData() {
  const { game } = usePlay();
  const { personaBySteps } = usePersona();

  return _.range(0, MAX_NUMBER_STEPS).map((step: number) => {
    if (step > game.step || (step === game.step && game.isStepActive)) {
      return {};
    }
    const persona = getPlayerValuesByStep(step, game, personaBySteps);
    return {
      name: step ? `Etape ${step}` : "Initial",
      renewable: sumFor(persona.consumption, "renewable"),
      fossil: sumFor(persona.consumption, "fossil"),
      mixte: sumFor(persona.consumption, "mixte"),
      grey: sumFor(persona.consumption, "grey"),
    };
  });
}
