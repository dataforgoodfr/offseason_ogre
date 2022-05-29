import { StackedEnergyBars } from "../../charts";
import { PlayBox } from "../Components";

export { StatsGraphs };

function StatsGraphs() {
  return (
    <PlayBox>
      <StackedEnergyBars data={buildData()} />
    </PlayBox>
  );
}

function buildData() {
  return [
    {
      name: "Initial",
      renewableEnergy: 30,
      fossilEnergy: 57,
      mixteEnergy: 15,
      greyEnergy: 112,
    },
    {
      name: "Step 1",
      renewableEnergy: 30,
      fossilEnergy: 57,
      mixteEnergy: 40,
    },
    {
      name: "Step 2",
      renewableEnergy: 90,
      fossilEnergy: 90,
      mixteEnergy: 9,
    },
    {
      name: "",
    },
    {
      name: "",
    },
    {
      name: "",
    },
  ];
}
