import React from "react";
import { Card, useTheme } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";

export { StackedEnergyBars };

function StackedEnergyBars({
  data,
  onClick,
}: {
  data: any[];
  onClick?: CategoricalChartFunc;
}) {
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
        mb: 1,
      }}
    >
      <BarChart width={500} height={500} data={data} onClick={onClick}>
        <XAxis dataKey="name" />
        <YAxis name="kWh/j" domain={[0, 300]} />
        <Tooltip />
        <Legend />
        <Bar
          barSize={25}
          dataKey="renewable"
          fill={theme.palette.energy.renewable}
          name={translateLabel("renewable")}
          stackId="a"
          unit="kWh"
        />
        <Bar
          dataKey="mixte"
          fill={theme.palette.energy.mixte}
          name={translateLabel("mixte")}
          stackId="a"
          unit="kWh"
        />
        <Bar
          dataKey="fossil"
          fill={theme.palette.energy.fossil}
          stackId="a"
          name={translateLabel("fossil")}
          unit="kWh"
        />
        <Bar
          dataKey="hydroProduction"
          fill={theme.palette.production.hydroProduction}
          barSize={25}
          name={translateLabel("hydroProduction")}
          stackId="a"
          unit="kWh"
        />
        <Bar
          dataKey="terrestrialProduction"
          stackId="a"
          fill={theme.palette.production.terrestrialProduction}
          barSize={25}
          name={translateLabel("terrestrialProduction")}
          unit="kWh"
        />
        <Bar
          dataKey="grey"
          stackId="a"
          fill={theme.palette.energy.grey}
          unit="kWh"
          name={translateLabel("grey")}
        />
      </BarChart>
    </Card>
  );
}

function translateLabel(value: string): string {
  const translations = {
    fossil: "Energie fossile",
    grey: "Energie grise",
    renewable: "Energie renouvelable",
    mixte: "Energie mixte",
    hydroProduction: "Production offshore",
    terrestrialProduction: "Production terrestre",
  } as Record<string, string>;
  return translations[value] ?? "Unkown";
}
