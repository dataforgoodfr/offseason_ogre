import { Card, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { usePlay } from "../play/context/playContext";

export { StackedEnergyBars };

function StackedEnergyBars({
  data,
  onClick,
}: {
  data: any[];
  onClick?: CategoricalChartFunc;
}) {
  const theme = useTheme();
  const { game } = usePlay();

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
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} onClick={onClick}>
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
            dataKey="offshore"
            fill={theme.palette.production.offshore}
            barSize={25}
            name={translateLabel("offshore")}
            stackId="a"
            unit="kWh"
          />
          <Bar
            dataKey="terrestrial"
            stackId="a"
            fill={theme.palette.production.terrestrial}
            barSize={25}
            name={translateLabel("terrestrial")}
            unit="kWh"
          />
          <Bar
            dataKey="grey"
            stackId="a"
            fill={theme.palette.energy.grey}
            unit="kWh"
            name={translateLabel("grey")}
          />
          {game.step >= 5 && (
            <Bar
              dataKey="nuclear"
              stackId="a"
              fill={theme.palette.production.nuclear}
              unit="kWh"
              name={translateLabel("nuclear")}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function translateLabel(value: string): string {
  const translations = {
    fossil: "Energie fossile",
    grey: "Energie grise",
    renewable: "Energie renouvelable",
    mixte: "Energie mixte",
    offshore: "Production offshore",
    terrestrial: "Production terrestre",
    nuclear: "Nucléaire",
  } as Record<string, string>;
  return translations[value] ?? "Unkown";
}
