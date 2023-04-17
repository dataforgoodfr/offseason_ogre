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
import { MaterialsPalette } from "../../utils/theme";
import { hasNuclear } from "../common/utils";
import { usePlay } from "../play/context/playContext";
import { productionConstants } from "../play";
import { MaterialsType, ProductionTypes } from "../../utils/types";
import { t } from "../translations";

export { MaterialsBars };

function MaterialsBars({
  data,
  tick = true,
  onClick,
}: {
  data: any[];
  tick?: boolean;
  onClick?: CategoricalChartFunc;
}) {
  const theme = useTheme();
  const { game } = usePlay();

  const formattedData = data
    .filter((material) => !["water", "geology"].includes(material.name))
    .filter(
      (material) =>
        material.name !== productionConstants.NUCLEAR.name || hasNuclear(game)
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
            {translateLabel(label)}
          </Typography>
          {Object.entries(payload[0].payload)
            .filter(([key]) => key !== "name" && key !== "type")
            .filter(
              ([key, value]) =>
                parseInt(value as string) && parseInt(value as string) !== 0
            )
            .map(([key, value]) => (
              <Typography
                key={key}
                sx={{
                  mt: 1,
                  mb: 1,
                  color:
                    theme.palette.materials[key as keyof MaterialsPalette] ||
                    "black",
                }}
              >
                {translateLabel(key)}: {value} MTonnes
              </Typography>
            ))}
        </Grid>
      );
    }
    return <></>;
  };

  const uniqueBars = formattedData
    .flatMap((d) =>
      Object.keys(d).filter((key) => !["name", "type"].includes(key))
    )
    .filter((value, index, array) => array.indexOf(value) === index)
    .reverse();

  return (
    <Card
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        pt: 4,
        pb: 4,
        pr: 2,
        pl: 2,
        mb: 1,
        mt: 1,
        ml: 1,
        mr: 1,
      }}
    >
      <ResponsiveContainer width="98%" height={500}>
        <BarChart data={formattedData} onClick={onClick}>
          <XAxis dataKey="name" tick={tick} tickFormatter={translateLabel} />
          <YAxis name="MTonnes" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {uniqueBars.map((key, idx) => (
            <Bar
              key={`${key}-${idx}`}
              dataKey={key}
              stackId="a"
              fill={
                theme.palette.materials[key as keyof MaterialsPalette] ||
                "black"
              }
              barSize={15}
              name={translateLabel(key)}
              unit="MTonnes"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

function translateLabel(value: string): string {
  return (
    t(`graph.materials.${value as MaterialsType | ProductionTypes}`) ??
    "Unknown"
  );
}
