import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { PlayBox } from "../Components";

export { StatsGraphs };

function StatsGraphs() {
  return (
    <PlayBox>
      <GraphGen />
    </PlayBox>
  );
}

const data1 = [
  {
    name: "Initial",

    EnergieDécarbonnée: 30,
    EnergieFossile: 57,
    EnergieMixte: 15,
    EnergieGrise: 112,
  },
  {
    name: "Initial",

    ProductionOffshore: 4,
    ProductionTerrestre: 10,
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
  {
    name: "",
  },
];

export default function GraphGen() {
  return (
    <div>
      <BarChart
        style={{ backgroundColor: "white" }}
        width={400}
        height={500}
        data={data1}
      >
        <XAxis dataKey="name" />
        <YAxis name="kWh/j" domain={[0, 300]} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="EnergieDécarbonnée"
          stackId="a"
          fill="#84BDF0"
          barSize={25}
          unit="kWh"
        />
        <Bar dataKey="EnergieMixte" stackId="a" fill="#F9C74F" unit="kWh" />
        <Bar dataKey="EnergieFossile" stackId="a" fill="#AF6A28" unit="kWh" />
        <Bar dataKey="EnergieGrise" stackId="a" fill="#6C6C6C" unit="kWh" />
        <Bar
          dataKey="ProductionOffshore"
          stackId="a"
          fill="#4C677E"
          barSize={25}
          unit="kWh"
        />
        <Bar
          dataKey="ProductionTerrestre"
          stackId="a"
          fill="#8A8256"
          barSize={25}
          unit="kWh"
        />
      </BarChart>
    </div>
  );
}
