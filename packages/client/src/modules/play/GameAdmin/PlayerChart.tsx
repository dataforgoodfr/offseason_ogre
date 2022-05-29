import { Box, Card } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export { PlayerChart };

const data5 = [
  {
    name: "Very long name",
    renewableEnergy: 30,
    fossilEnergy: 57,
    mixteEnergy: 15,
    greyEnergy: 112,
  },
  {
    name: "Prod",
    offshoreProduction: 4,
    terrestrialProduction: 10,
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
            barSize={25}
            dataKey="renewableEnergy"
            fill="#84BDF0"
            name={translateLabel("renewableEnergy")}
            stackId="a"
            unit="kWh"
          />
          <Bar
            dataKey="mixteEnergy"
            fill="#F9C74F"
            name={translateLabel("mixteEnergy")}
            stackId="a"
            unit="kWh"
          />
          <Bar
            dataKey="fossilEnergy"
            stackId="a"
            fill="#AF6A28"
            name={translateLabel("fossilEnergy")}
            unit="kWh"
          />
          <Bar
            dataKey="offshoreProduction"
            fill="#4C677E"
            barSize={25}
            name={translateLabel("offshoreProduction")}
            stackId="a"
            unit="kWh"
          />
          <Bar
            dataKey="terrestrialProduction"
            stackId="a"
            fill="#8A8256"
            barSize={25}
            name={translateLabel("terrestrialProduction")}
            unit="kWh"
          />
          <Bar
            dataKey="greyEnergy"
            stackId="a"
            fill="#6C6C6C"
            unit="kWh"
            name={translateLabel("greyEnergy")}
          />
        </BarChart>
      </Card>
    </Box>
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
