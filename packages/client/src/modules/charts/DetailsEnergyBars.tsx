import { Card } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Persona } from "../persona/persona";

export { DetailsEnergyBars };

function DetailsEnergyBars({ persona }: { persona: Persona }) {
  const colors = ["#F9C74F", "#84BDF0", "#AF6A28", "Grey"];
  return (
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
      <BarChart
        width={500}
        height={550}
        data={persona.consumption}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit="kWh" />
        <YAxis type="category" width={160} dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" unit="kWh">
          {persona.consumption.map(({ name }) => (
            <Cell key={`cell-${name}`} fill={colors[0]} />
          ))}
        </Bar>
      </BarChart>
    </Card>
  );
}
