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
          dataKey="renewableEnergy"
          fill={theme.palette.energy.renewable}
          name={translateLabel("renewableEnergy")}
          stackId="a"
          unit="kWh"
        />
        <Bar
          dataKey="mixteEnergy"
          fill={theme.palette.energy.mixte}
          name={translateLabel("mixteEnergy")}
          stackId="a"
          unit="kWh"
        />
        <Bar
          dataKey="fossilEnergy"
          fill={theme.palette.energy.fossile}
          stackId="a"
          name={translateLabel("fossilEnergy")}
          unit="kWh"
        />
        <Bar
          dataKey="hydroProduction"
          fill={theme.palette.production.offshore}
          barSize={25}
          name={translateLabel("hydroProduction")}
          stackId="a"
          unit="kWh"
        />
        <Bar
          dataKey="terrestrialProduction"
          stackId="a"
          fill={theme.palette.production.terrestrial}
          barSize={25}
          name={translateLabel("terrestrialProduction")}
          unit="kWh"
        />
        <Bar
          dataKey="greyEnergy"
          stackId="a"
          fill={theme.palette.energy.grey}
          unit="kWh"
          name={translateLabel("greyEnergy")}
        />
      </BarChart>
    </Card>
  );
}

function translateLabel(value: string): string {
  const translations = {
    fossilEnergy: "Energie fossile",
    greyEnergy: "Energie grise",
    renewableEnergy: "Energie renouvelable",
    mixteEnergy: "Energie mixte",
    hydroProduction: "Production offshore",
    terrestrialProduction: "Production terrestre",
  } as Record<string, string>;
  return translations[value] ?? "Unkown";
}
