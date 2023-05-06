import { Card, Grid, useTheme } from "@mui/material";
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
import { hasNuclear, filterOutDuplicates } from "../common/utils";
import { usePlay } from "../play/context/playContext";
import { productionConstants } from "../play";
import { t } from "../translations";
import { ConsumptionType } from "../persona/consumption";
import { ProductionActionType } from "../../utils/types";
import { Typography } from "../common/components/Typography";

export { StackedEnergyBars };

function StackedEnergyBars({
  title,
  data,
  tick = true,
  onClick,
}: {
  title?: string;
  data: any[];
  tick?: boolean;
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
            .filter(([key]) => key !== "name" && key !== "type")
            .filter(
              ([key]) =>
                key !== productionConstants.NUCLEAR.name || hasNuclear(game)
            )
            .map(([key, value]) => (
              <Typography
                key={key}
                sx={{
                  mt: 1,
                  mb: 1,
                  color:
                    theme.palette.energy[key as keyof EnergyPalette] ||
                    theme.palette.production[key as keyof ProductionPalette] ||
                    "black",
                }}
              >
                {translateLabel(key)}: {value}kWh/jour
              </Typography>
            ))}
        </Grid>
      );
    }
    return <></>;
  };

  const uniqueBars = data
    .flatMap((d) =>
      Object.keys(d)
        .filter((key) => !["name", "total", "type"].includes(key))
        .filter(
          (key) => key !== productionConstants.NUCLEAR.name || hasNuclear(game)
        )
    )
    .filter(filterOutDuplicates)
    .reverse();

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: 4,
        pb: 4,
        pr: 2,
        pl: 2,
        mb: 1,
      }}
    >
      {!!title && (
        <Typography variant="h5" sx={{ mb: 4, textAlign: "center" }}>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} onClick={onClick}>
          <XAxis dataKey="name" tick={tick} />
          <YAxis
            name="kWh/jour"
            domain={[0, Math.ceil(maximumTotal / 100) * 100]}
            {...{ angle: -45 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {uniqueBars.map((key, idx) => (
            <Bar
              key={`${key}-${idx}`}
              dataKey={key}
              stackId="a"
              fill={
                theme.palette.energy[key as keyof EnergyPalette] ||
                theme.palette.production[key as keyof ProductionPalette] ||
                "black"
              }
              barSize={25}
              name={translateLabel(key)}
              unit="kWh/jour"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function translateLabel(value: string): string {
  return (
    t(`graph.energy.${value as ConsumptionType | ProductionActionType}`) ??
    "Unknown"
  );
}
