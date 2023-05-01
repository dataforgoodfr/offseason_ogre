import { Card, Grid, Theme, Typography, useTheme } from "@mui/material";
import {
  ComposedChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  Line,
} from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toArray } from "../../lib/array";
import { UnwrapArray } from "../../utils/types";
import { range } from "lodash";
import { pipe } from "../../lib/fp";

export { StackedBars };
export type {
  StackedBarsBar,
  StackedBarsLine,
  StackedBarsStacks,
  StackedBarsStackData,
};

interface StackedBarsStacks extends DataSourceConfig {
  data: StackedBarsStackData[];
}

interface StackedBarsStackData {
  label: string;
  total: number;
  bars: StackedBarsBar[];
}

interface StackedBarsBar {
  /** Used to pick the color of the bar from the palettes. */
  key: string;
  label: string;
  total: number;
}

interface StackedBarsLine extends DataSourceConfig {
  /** Used to pick the color of the line from the palettes. */
  key: string;
  label: string;
  data: number[];
}

type DataSource = keyof Pick<StackedBarsProps, "lines" | "stacks">;
interface DataSourceConfig {
  yAxisUnitLabel: string;
  palettes?: keyof Theme["palette"] | (keyof Theme["palette"])[];
  hideInTooltip?: boolean;
  /** Whether to display items with a value of 0 in the tooltip. Defaults to false. */
  keepZerosInTooltip?: boolean;
  yAxisValueFormatter: (value?: number) => string;
}

interface StackedBarsProps {
  stacks: StackedBarsStacks;
  lines?: StackedBarsLine[];
  tick?: boolean;
  direction?: "horizontal" | "vertical";
  onClick?: CategoricalChartFunc;
}

function StackedBars({
  stacks,
  lines = [],
  tick = true,
  direction = "horizontal",
  onClick,
}: StackedBarsProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const maximumTotal = useMemo(
    () =>
      Math.max(
        ...stacks.data.map((stack) => stack.total),
        ...lines.flatMap((line) => line.data),
        0
      ),
    [lines, stacks]
  );

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

  const buildDataKey = (
    dataSource: DataSource,
    key: string,
    lineIdx?: number
  ) => {
    return `${dataSource}__${key}__${lineIdx}`;
  };

  const extractDataFromDataKey = (dataKey: string) => {
    const splitDataKey = dataKey.split("__");
    return {
      dataSource: splitDataKey[0] as DataSource,
      key: splitDataKey[1],
      lineIdx: parseInt(splitDataKey[2] || "0"),
    };
  };

  const getDataSourceConfig = (
    dataSource: DataSource,
    lineIdx?: number
  ): DataSourceConfig => {
    return dataSource === "stacks"
      ? stacks
      : dataSource === "lines"
      ? lines[lineIdx!]!
      : {
          yAxisUnitLabel: "",
          hideInTooltip: false,
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

      const getItemDataSource = (
        item: UnwrapArray<NonNullable<typeof payload>>
      ) => {
        const { dataSource, lineIdx } = extractDataFromDataKey(
          item.dataKey as string
        );
        return getDataSourceConfig(dataSource, lineIdx);
      };

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

      const sortItems = (
        itemA: UnwrapArray<NonNullable<typeof payload>>,
        itemB: UnwrapArray<NonNullable<typeof payload>>
      ) => {
        if (
          (itemA.dataKey as string).startsWith("stacks") &&
          (itemB.dataKey as string).startsWith("stacks")
        ) {
          return 0;
        }
        if ((itemA.dataKey as string).startsWith("stacks")) {
          return 1;
        }
        return -1;
      };

      return (
        payload
          .filter((item) => {
            const dataSourceConfig = getItemDataSource(item);
            if (dataSourceConfig.hideInTooltip) {
              return false;
            }
            if (!dataSourceConfig.keepZerosInTooltip && item.value === 0) {
              return false;
            }
            return true;
          })
          .map((item) => {
            const { key } = extractDataFromDataKey(item.dataKey as string);
            const dataSourceConfig = getItemDataSource(item);
            return enrichItem(dataSourceConfig, key, item);
          })
          .sort(sortItems as any)
          .concat(
            enrichItem(getDataSourceConfig("stacks"), "total", {
              dataKey: "total",
              name: t("graph.common.total"),
              value: stack.total,
            })
          )
          // The bars contained in the payload are in reverse order
          // compared to their display order.
          .reverse()
      );
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

  const barsGraph = useMemo(() => {
    const dataSource: DataSource = "stacks";

    return pipe(
      stacks,
      (stacks) =>
        stacks.data
          .flatMap((stack) => stack.bars)
          .map((bar) => [
            buildDataKey(dataSource, bar.key),
            {
              ...bar,
              dataKey: buildDataKey(dataSource, bar.key),
              unit: stacks.yAxisUnitLabel,
              fill: getColorFromPalettes(bar.key, stacks.palettes),
            },
          ]),
      Object.fromEntries,
      Object.values
    );
  }, [stacks, getColorFromPalettes]);

  const linesGraph = useMemo(() => {
    const dataSource: DataSource = "lines";

    if (!lines) {
      return [];
    }

    return pipe(
      lines,
      (lines) =>
        lines.map((line, idx) => {
          const dataKey = buildDataKey(dataSource, line.key, idx);
          return [
            dataKey,
            {
              ...line,
              dataKey,
              unit: line.yAxisUnitLabel,
              stroke: getColorFromPalettes(line.key, line.palettes),
            },
          ];
        }),
      Object.fromEntries,
      Object.values
    );
  }, [lines, getColorFromPalettes]);

  const data = useMemo(() => {
    return range(0, stacks.data.length).map((dataIdx) => {
      const stack = stacks.data[dataIdx];
      return {
        label: stack.label,
        total: stack.total,
        ...Object.fromEntries(
          stack.bars.map((bar) => [buildDataKey("stacks", bar.key), bar.total])
        ),
        ...Object.fromEntries(
          lines.map((line, lineIdx) => [
            buildDataKey("lines", line.key, lineIdx),
            line.data[dataIdx],
          ])
        ),
      };
    });
  }, [lines, stacks]);

  const chartConfig = useMemo(() => {
    const mainAxisProps = {
      type: "category",
      dataKey: "label",
      tick,
    };

    const secondaryAxisProps = {
      type: "number",
      domain: [0, Math.ceil(maximumTotal / 100) * 100],
    };

    const layout = lines?.length ? "horizontal" : direction;

    return {
      layout,
      xAxisProps: layout === "horizontal" ? mainAxisProps : secondaryAxisProps,
      yAxisProps: layout === "horizontal" ? secondaryAxisProps : mainAxisProps,
      ChartComponent:
        !lines?.length || layout === "vertical" ? BarChart : ComposedChart,
    };
  }, [direction, lines, maximumTotal, tick]);

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
        <chartConfig.ChartComponent
          data={data}
          onClick={onClick}
          layout={chartConfig.layout}
        >
          <XAxis {...(chartConfig.xAxisProps as any)} />
          <YAxis {...(chartConfig.yAxisProps as any)} angle={-45} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {barsGraph.map((bar, idx) => (
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
          {linesGraph.map((line, idx) => (
            <Line
              key={`${line.dataKey}-${idx}`}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              name={line.label}
              unit={line.unit}
            />
          ))}
        </chartConfig.ChartComponent>
      </ResponsiveContainer>
    </Card>
  );
}
