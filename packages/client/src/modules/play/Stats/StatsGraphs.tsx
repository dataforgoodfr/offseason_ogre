import React from "react";
import { StackedEnergyBars, DetailsEnergyBars } from "../../charts";
import { PlayBox } from "../Components";
import { EnergyButtons } from "../../common/components/EnergyButtons";
import { MAX_NUMBER_STEPS } from "../constants";
import _ from "lodash";
import { usePersonaByStep } from "../context/playContext";
import { sumFor } from "../../persona";

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
  const personaByStep = usePersonaByStep();
  if (typeof step === "undefined") return <></>;
  const persona = personaByStep[step];
  return (
    <>
      <DetailsEnergyBars persona={persona} />
      <EnergyButtons persona={persona} />
    </>
  );
}

function useStackedEnergyData() {
  const personaByStep = usePersonaByStep();
  return _.range(0, MAX_NUMBER_STEPS).map((step: number) => {
    const persona = personaByStep[step];
    return {
      name: step ? `Etape ${step}` : "Initial",
      renewableEnergy: sumFor(persona.consumption, "renewableEnergy"),
      fossilEnergy: sumFor(persona.consumption, "fossilEnergy"),
      mixteEnergy: sumFor(persona.consumption, "mixteEnergy"),
      greyEnergy: sumFor(persona.consumption, "greyEnergy"),
    };
  });
}
