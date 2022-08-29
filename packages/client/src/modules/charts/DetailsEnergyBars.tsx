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
import { roundValue } from "../common/utils";
import { Persona } from "../persona/persona";
import { translateName } from "../translations";

export { DetailsEnergyConsumptionBars, DetailsEnergyProductionBars };

function DetailsEnergyConsumptionBars({ persona }: { persona: Persona }) {
  return DetailsEnergyBars("consumption", persona);
}

function DetailsEnergyProductionBars({ persona }: { persona: Persona }) {
  const theme = useTheme();
  return DetailsEnergyBars("production", persona);
}

function DetailsEnergyBars(energyType: string, persona: Persona) {
  const theme = useTheme();
  const personaValues =
    energyType === "consumption" ? persona.consumption : persona.production;
  const palette =
    energyType === "consumption"
      ? theme.palette.energy
      : theme.palette.production;

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
        data={personaValues.map((item) => ({
          ...item,
          value: roundValue(item.value),
          name: translateName(energyType, item.name),
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
          {personaValues.map(({ name, type }) => {
            return (
              <Cell
                key={`cell-${name}`}
                fill={(palette as any)[type] || "blue"}
              />
            );
          })}
        </Bar>
      </BarChart>
    </Card>
  );
}
