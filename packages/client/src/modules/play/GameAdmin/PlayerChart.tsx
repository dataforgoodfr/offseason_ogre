import { Box, Card } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export { PlayerChart };

const data5 = [
  {
    name: "J1",
    EnergieRenouvelable: 30,
    EnergieFossile: 57,
    EnergieMixte: 15,
    EnergieGrise: 112,
  },
  {
    name: "J2",
    EnergieRenouvelable: 30,
    EnergieFossile: 57,
    EnergieMixte: 15,
    EnergieGrise: 112,
  },
  {
    name: "J3",
    EnergieRenouvelable: 30,
    EnergieFossile: 57,
    EnergieMixte: 15,
    EnergieGrise: 112,
  },
  {
    name: "J4",
    EnergieRenouvelable: 30,
    EnergieFossile: 57,
    EnergieMixte: 15,
    EnergieGrise: 112,
  },
  {
    name: "J5",
    EnergieRenouvelable: 30,
    EnergieFossile: 57,
    EnergieMixte: 15,
    EnergieGrise: 112,
  },
  {
    name: "Prod",
    ProductionOffshore: 4,
    ProductionTerrestre: 10,
  },
];

function PlayerChart() {
  return (
    <Box p={2}>
      <Card
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          pt: 4,
          pb: 4,
          pr: 2,
          pl: 2,
        }}
      >
        <BarChart width={500} height={500} data={data5}>
          <XAxis dataKey="name" />
          <YAxis name="kWh/j" domain={[0, 300]} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="EnergieRenouvelable"
            stackId="a"
            fill="#84BDF0"
            barSize={25}
            unit="kWh"
          />
          <Bar dataKey="EnergieMixte" stackId="a" fill="#F9C74F" unit="kWh" />
          <Bar dataKey="EnergieFossile" stackId="a" fill="#AF6A28" unit="kWh" />
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
          <Bar dataKey="EnergieGrise" stackId="a" fill="#6C6C6C" unit="kWh" />
        </BarChart>
      </Card>
    </Box>
  );
}
