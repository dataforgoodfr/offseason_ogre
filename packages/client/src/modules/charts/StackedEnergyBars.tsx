import React from "react";
import { Card, useTheme } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export { StackedEnergyBars };



function StackedEnergyBars({ data, getState, isShowingDetails }: { data: any[], getState: Function, isShowingDetails: boolean }) {

  const theme = useTheme()

  return (
    <Card
      sx={
        isShowingDetails ? {
          width: "50%",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          pt: 2,
          pb: 2,
          pr: 1,
          pl: 1,
        } : {
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          pt: 4,
          pb: 4,
          pr: 2,
          pl: 2,
        }}
    >
      <BarChart width={500} height={500} data={data} onClick={(e) => getState(e)}>
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
          dataKey="offshoreProduction"
          fill={theme.palette.production.offshore}
          barSize={25}
          name={translateLabel("offshoreProduction")}
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
    offshoreProduction: "Production offshore",
    terrestrialProduction: "Production terrestre",
  } as Record<string, string>;
  return translations[value] ?? "Unkown";
}
