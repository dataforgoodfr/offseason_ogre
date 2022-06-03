import React from "react"
import { StackedEnergyBars, DetailsEnergyBars } from "../../charts";
import { PlayBox } from "../Components";
import { EnergyButtons } from "../../common/components/EnergyButtons";


export { StatsGraphs };



function StatsGraphs() {

  const [isShowingDetails, setIsShowingDetails] = React.useState(false)
  const [activeLabel, setActiveLabel] = React.useState("");

  function getState(e: any) {
    buildData().forEach(elm => {
      if (e.activeLabel && e.activeLabel === elm.name) {
        setActiveLabel(e.activeLabel) // e.activeLabel is the click event key with values "Initial", "Step 1", "Step 2" ... which identifiy the differents bars
        setIsShowingDetails(!isShowingDetails)
      }
    })
  }

  return (
    <PlayBox>
      <StackedEnergyBars data={buildData()} getState={getState} isShowingDetails={isShowingDetails} />
      {
        isShowingDetails ?
          <>
            <DetailsEnergyBars data={data} colors={colors} />
            <EnergyButtons />
          </>
          : <></>
      }
    </PlayBox>
  );
}

const colors = ["#F9C74F", "#84BDF0", "#AF6A28", "Grey"];

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
    Type: 1
  },
  { name: "Service public", value: 8, Type: 3 },
  { name: "Eclairage", value: 4, Type: 1 },
  { name: "Train", value: 2, Type: 3 },
  { name: "Climatisation", value: 16, Type: 1 },
  { name: "Numérique", value: 11, Type: 3 },
  { name: "ProduitsBruns", value: 7, Type: 1 }
]

data.sort(function (a, b) {
  return b.value - a.value;
});
data.sort(function (a, b) {
  return b.Type - a.Type;
});


