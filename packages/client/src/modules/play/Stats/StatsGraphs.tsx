import { Box, useTheme } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export { StatsGraphs };

function StatsGraphs() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        mt: 2,
        pl: 2,
        pr: 2,
        pb: 2,
        border: "2px solid white",
        borderRadius: "10px",
        bgcolor: theme.palette.primary.main,
        color: "white",
      }}
    >
      <GraphGen />
    </Box>
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
