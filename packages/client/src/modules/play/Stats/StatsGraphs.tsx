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
          console.log("activeTooltipIndex", activeTooltipIndex);
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
      <EnergyButtons data={data} />
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

const data = [
  { name: "Fret", value: 12, Type: 3 },
  { name: "Manufacture de voiture", value: 42, Type: 3 },
  { name: "Construction", value: 3, Type: 3 },
  { name: "Autre", value: 36, Type: 3 },
  { name: "Voiture thermique", value: 25, Type: 2 },
  { name: "Voiture éléctrique", value: 0, Type: 1 },
  { name: "ChauffageFossile", value: 27, Type: 2 },
  { name: "Avion", value: 5, Type: 2 },
  { name: "Se nourrir", value: 15, Type: 0 },
  { name: "Chauffage électrique", value: 2, Type: 1 },
  {
    name: "Usage domestique",
    value: 17,
    Type: 1,
  },
  { name: "Service public", value: 8, Type: 3 },
  { name: "Eclairage", value: 4, Type: 1 },
  { name: "Train", value: 2, Type: 3 },
  { name: "Climatisation", value: 16, Type: 1 },
  { name: "Numérique", value: 11, Type: 3 },
  { name: "ProduitsBruns", value: 7, Type: 1 },
];

data.sort(function (a, b) {
  return b.value - a.value;
});
data.sort(function (a, b) {
  return b.Type - a.Type;
});
