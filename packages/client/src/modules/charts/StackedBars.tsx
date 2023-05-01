import { Card, Grid, Theme, Typography, useTheme } from "@mui/material";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toArray } from "../../lib/array";
import { UnwrapArray } from "../../utils/types";

export { StackedBars };
export type { StackedBarsStacks, StackedBarsStackData, StackedBarsBar };

interface StackedBarsStacks extends DataSourceConfig {
  data: StackedBarsStackData[];
}

interface StackedBarsStackData {
  label: string;
  total: number;
  bars: StackedBarsBar[];
}

interface StackedBarsBar {
  key: string;
  label: string;
  total: number;
}

type DataSource = keyof Pick<StackedBarsProps, "stacks">;
interface DataSourceConfig {
  yAxisUnitLabel: string;
  palettes?: keyof Theme["palette"] | (keyof Theme["palette"])[];
  yAxisValueFormatter: (value?: number) => string;
}

interface StackedBarsProps {
  stacks: StackedBarsStacks;
  tick?: boolean;
  onClick?: CategoricalChartFunc;
}

function StackedBars({ stacks, tick = true, onClick }: StackedBarsProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const maximumTotal = Math.max(...stacks.data.map((stack) => stack.total), 0);

  const getColorFromPalettes = useCallback(
    (
      key: string,
      palettes: keyof Theme["palette"] | (keyof Theme["palette"])[] = []
    ): string => {
      const keyToColor = Object.assign(
        {},
        ...toArray(palettes).map(
          (paletteName) => theme.palette[paletteName as keyof Theme["palette"]]
        )
      );
      return keyToColor?.[key || ""] || "black";
    },
    [theme.palette]
  );

  const buildDataKey = (dataSource: DataSource, key: string) => {
    return `${dataSource}-${key}`;
  };

  const extractDataFromDataKey = (dataKey: string) => {
    const splitDataKey = dataKey.split("-");
    return {
      dataSource: splitDataKey[0] as DataSource,
      key: splitDataKey[1],
    };
  };

  const getDataSourceConfig = (dataSource: DataSource): DataSourceConfig => {
    return dataSource === "stacks"
      ? stacks
      : {
          yAxisUnitLabel: "",
          yAxisValueFormatter: (value) => `${value}`,
        };
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>): JSX.Element => {
    const items = useMemo(() => {
      if (!payload?.length) {
        return [];
      }

      const enrichItem = (
        dataSourceConfig: DataSourceConfig,
        key: string,
        item: UnwrapArray<NonNullable<typeof payload>>
      ) => {
        return {
          ...item,
          value: dataSourceConfig.yAxisValueFormatter(item.value),
          unit: dataSourceConfig.yAxisUnitLabel,
          color: getColorFromPalettes(key, dataSourceConfig.palettes),
        };
      };

      const stack: { label: string; total: number } = payload[0].payload;

      return payload
        .map((item) => {
          const { dataSource, key } = extractDataFromDataKey(
            item.dataKey as string
          );
          const dataSourceConfig = getDataSourceConfig(dataSource);

          return enrichItem(dataSourceConfig, key, item);
        })
        .concat(
          enrichItem(getDataSourceConfig("stacks"), "total", {
            dataKey: "total",
            name: t("graph.common.total"),
            value: stack.total,
          })
        )
        .reverse();
    }, [payload]);

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
          {items.map((item) => (
            <Typography
              key={item.dataKey}
              sx={{
                mt: 1,
                mb: 1,
                color: item.color,
              }}
            >
              {item.name}: {item.value} {item.unit}
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
        stacks.data
          .flatMap((stack) => stack.bars)
          .map((bar) => [
            buildDataKey("stacks", bar.key),
            {
              ...bar,
              dataKey: buildDataKey("stacks", bar.key),
              unit: stacks.yAxisUnitLabel,
              fill: getColorFromPalettes(bar.key, stacks.palettes),
            },
          ])
      )
    );
  }, [stacks, getColorFromPalettes]);

  const data = useMemo(() => {
    return stacks.data.map((stack) => ({
      label: stack.label,
      total: stack.total,
      ...Object.fromEntries(
        stack.bars.map((bar) => [buildDataKey("stacks", bar.key), bar.total])
      ),
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
        <ComposedChart data={data} onClick={onClick}>
          <XAxis dataKey="label" tick={tick} />
          <YAxis domain={[0, Math.ceil(maximumTotal / 100) * 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {bars.map((bar, idx) => (
            <Bar
              key={`${bar.dataKey}-${idx}`}
              dataKey={bar.dataKey}
              stackId="a"
              fill={bar.fill}
              barSize={25}
              name={bar.label}
              unit={bar.unit}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
