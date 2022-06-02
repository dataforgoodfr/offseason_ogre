import React from "react"
import { StackedEnergyBars, DetailsEnergyBars } from "../../charts";
import { PlayBox } from "../Components";

export { StatsGraphs };



function StatsGraphs() {

  const [isShowingDetails, setIsShowingDetails] = React.useState(false)

  function getState(e: any) {
    buildData().forEach(elm => {
      e.activeLabel === elm.name ? setIsShowingDetails(!isShowingDetails) : <></>
    })
  }

  return (
    <PlayBox sx={
      isShowingDetails ? { display: "flex", m: 1, justifyContent: "space-around" } : {}
    }>
      <StackedEnergyBars data={buildData()} getState={getState} isShowingDetails={isShowingDetails} />
      {
        isShowingDetails == true ? <DetailsEnergyBars data={data} colors={colors} isShowingDetails={isShowingDetails} /> : <></>
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

