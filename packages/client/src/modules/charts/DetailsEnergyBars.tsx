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
        <XAxis type="number" unit="kWh" />
        <YAxis type="category" width={160} dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" unit="kWh">
          {persona.consumption.map(({ name, type }) => {
            return (
              <Cell
                key={`cell-${name}`}
                fill={
                  theme.palette.energy[
                    type.slice(0, -6) as keyof typeof theme.palette.energy
                  ] || "blue"
                }
              />
            );
          })}
        </Bar>
      </BarChart>
    </Card>
  );
}

function translateConsumptionName(value: string): string {
  const translationByValue = {
    airConditionning: "Air climatisé",
    cleanCook: "Cuisine écologique",
    brownGoods: "Produits bruns",
    electricCar: "Voiture électrique",
    light: "Lumière",
    fossilCar: "Voiture thermique",
    fossilHeating: "Chauffage thermique",
    greyCar: "Voiture (gris)",
    greyHouse: "Maison (gris)",
    greyNumeric: "Numérique (gris)",
    greyOther: "Autre (gris)",
    greyTransport: "Transport (gris)",
    food: "Nourriture",
    noCarbonHeating: "Chauffage décarbonné",
    plane: "Avion",
    servicePublic: "Service public",
    train: "Train",
  };
  return translationByValue[value as keyof typeof translationByValue] ?? value;
}
