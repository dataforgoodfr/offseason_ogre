import { Card, Grid, Typography, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { EnergyPalette, ProductionPalette } from "../../utils/theme";
import { hasNuclear } from "../common/utils";
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

  const maximumTotal = Math.max(
    ...data.map((pileData: any) => pileData.total),
    0
  );

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>): JSX.Element => {
    if (active && payload && payload.length) {
      return (
        <Grid
          sx={{
            backgroundColor: "white",
            color: "black",
            border: "1px solid lightgrey",
            p: 2,
          }}
        >
          <Typography
            sx={{
              mb: 1,
              color: theme.palette.primary.main,
              fontWeight: "bolder",
            }}
          >
            {label}
          </Typography>
          {Object.entries(payload[0].payload)
            .filter(([key]) => key !== "name")
            .filter(([key]) => (!hasNuclear(game) ? key !== "nuclear" : true))
            .map(([key, value]) => (
              <Typography
                sx={{
                  mt: 1,
                  mb: 1,
                  color:
                    theme.palette.energy[key as keyof EnergyPalette] ||
                    theme.palette.production[key as keyof ProductionPalette] ||
                    "black",
                }}
              >
                {translateLabel(key)}: {value}kWh
              </Typography>
            ))}
        </Grid>
      );
    }
    return <></>;
  };

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
          <YAxis
            name="kWh/j"
            domain={[0, Math.ceil(maximumTotal / 100) * 100]}
          />
          <Tooltip content={<CustomTooltip />} />
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
          {hasNuclear(game) && (
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
    total: "Total",
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
