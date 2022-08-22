import { Card, useTheme } from "@mui/material";
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
import { translateConsumptionName } from "../translations";

export { DetailsEnergyBars };

function DetailsEnergyBars({ persona }: { persona: Persona }) {
  const theme = useTheme();
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
        data={persona.consumption.map((item) => ({
          ...item,
          value: Math.round((item.value + Number.EPSILON) * 100) / 100,
          name: translateConsumptionName(item.name),
        }))}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 50]} unit="kWh" />
        <YAxis type="category" width={160} dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" unit="kWh">
          {persona.consumption.map(({ name, type }) => {
            return (
              <Cell
                key={`cell-${name}`}
                fill={theme.palette.energy[type] || "blue"}
              />
            );
          })}
        </Bar>
      </BarChart>
    </Card>
  );
}
