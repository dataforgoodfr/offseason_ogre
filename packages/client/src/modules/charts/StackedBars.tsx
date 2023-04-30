import { Card, Grid, Theme, Typography, useTheme } from "@mui/material";
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
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toArray } from "../../lib/array";

export { StackedBars };
export type { StackedBarsStack, StackedBarsBar };

interface StackedBarsStack {
  label: string;
  total: number;
  bars: StackedBarsBar[];
}

interface StackedBarsBar {
  key: string;
  label: string;
  total: number;
}

function StackedBars({
  stacks,
  yAxisUnitLabel,
  tick = true,
  palettes: palettesProps = [],
  onClick,
  yAxisValueFormatter,
}: {
  stacks: StackedBarsStack[];
  yAxisUnitLabel: string;
  tick?: boolean;
  palettes?: keyof Theme["palette"] | (keyof Theme["palette"])[];
  onClick?: CategoricalChartFunc;
  yAxisValueFormatter: (value?: number) => string;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const maximumTotal = Math.max(...stacks.map((stack) => stack.total), 0);

  const palettes = useMemo(() => {
    return Object.assign(
      {},
      ...toArray(palettesProps).map(
        (paletteName) => theme.palette[paletteName as keyof Theme["palette"]]
      )
    );
  }, [palettesProps, theme]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>): JSX.Element => {
    if (active && payload && payload.length) {
      const stack: { label: string; total: number } = payload[0].payload;

      const bars = [
        ...payload,
        {
          dataKey: "total",
          name: t("graph.common.total"),
          value: stack.total,
          unit: yAxisUnitLabel,
        },
      ].reverse();

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
          {bars.map((bar) => (
            <Typography
              key={bar.dataKey}
              sx={{
                mt: 1,
                mb: 1,
                color: palettes[bar.dataKey || ""] || "black",
              }}
            >
              {bar.name}: {yAxisValueFormatter(bar.value)} {bar.unit}
            </Typography>
          ))}
        </Grid>
      );
    }
    return <></>;
  };

  const bars = useMemo(() => {
    return Object.values(
      Object.fromEntries(
        stacks.flatMap((stack) => stack.bars).map((bar) => [bar.key, bar])
      )
    );
  }, [stacks]);

  const data = useMemo(() => {
    return stacks.map((stack) => ({
      label: stack.label,
      total: stack.total,
      ...Object.fromEntries(stack.bars.map((bar) => [bar.key, bar.total])),
    }));
  }, [stacks]);

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
          <XAxis dataKey="label" tick={tick} />
          <YAxis
            name={yAxisUnitLabel}
            domain={[0, Math.ceil(maximumTotal / 100) * 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {bars.map((bar, idx) => (
            <Bar
              key={`${bar.key}-${idx}`}
              dataKey={bar.key}
              stackId="a"
              fill={palettes[bar.key || ""] || "black"}
              barSize={25}
              name={bar.label}
              unit={yAxisUnitLabel}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
