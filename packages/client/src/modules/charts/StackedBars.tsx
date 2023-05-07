import { Card, Grid, Theme, useTheme } from "@mui/material";
import {
  ComposedChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  YAxisProps,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  Line,
  BarProps,
  LineProps,
  XAxisProps,
} from "recharts";
import { CategoricalChartFunc } from "recharts/types/chart/generateCategoricalChart";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toArray } from "../../lib/array";
import { UnwrapArray } from "../../utils/types";
import { range } from "lodash";
import { pipe } from "../../lib/fp";
import { Typography } from "../common/components/Typography";
import { ObjectBuilder } from "../../lib/object";

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
  useLinesAxis?: boolean;
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
  title?: string;
  stacks: StackedBarsStacks;
  lines?: StackedBarsLine[];
  tick?: boolean;
  direction?: "horizontal" | "vertical";
  onClick?: CategoricalChartFunc;
}

function StackedBars({
  title,
  stacks,
  lines = [],
  tick = true,
  direction = "horizontal",
  onClick,
}: StackedBarsProps) {
  const theme = useTheme();
  const { t } = useTranslation();

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
    const chunks: (string | number)[] = [dataSource, key];
    if (lineIdx != null) {
      chunks.push(lineIdx);
    }
    return chunks.join("__");
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
    type AxisProps =
      | Partial<Omit<XAxisProps, "xAxisId">>
      | Partial<Omit<YAxisProps, "yAxisId">>;
    type AxisPropsBuilderArgs = AxisProps & {
      maxTotal?: number;
      axisId?: DataSource;
      angle?: number;
    };

    const layout = lines?.length ? "horizontal" : direction;
    const isHorizontalLayout = layout === "horizontal";

    const buildMainAxisProps = ({
      ...otherProps
    }: AxisPropsBuilderArgs = {}): AxisProps => {
      return {
        ...otherProps,
        type: "category",
        dataKey: "label",
        tick,
      };
    };

    const buildCrossAxisProps = ({
      maxTotal,
      axisId,
      ...otherProps
    }: AxisPropsBuilderArgs = {}): AxisProps => {
      const axisIdProps = axisId
        ? isHorizontalLayout
          ? { yAxisId: axisId }
          : { xAxisId: axisId }
        : {};

      return {
        ...otherProps,
        ...axisIdProps,
        type: "number",
        domain: [0, Math.ceil((maxTotal || 0) / 100) * 100],
      };
    };

    const buildCrossAxisForStacks = () => {
      const linesOnStacksAxis = lines.filter((line) => !!line.useLinesAxis);
      const maxTotal = Math.max(
        ...stacks.data.map((stack) => stack.total),
        ...linesOnStacksAxis.flatMap((line) => line.data),
        0
      );

      return buildCrossAxisProps({
        axisId: "stacks",
        maxTotal,
        angle: isHorizontalLayout ? -45 : 0,
      });
    };

    const buildCrossAxisForLines = () => {
      const linesOnLinesAxis = lines.filter((line) => !!line.useLinesAxis);
      const hasMultipleCrossAxes = !!linesOnLinesAxis.length;

      if (!hasMultipleCrossAxes) {
        return null;
      }

      const maxTotal = Math.max(
        ...linesOnLinesAxis.flatMap((line) => line.data),
        0
      );

      return buildCrossAxisProps({
        axisId: "lines",
        maxTotal,
        angle: isHorizontalLayout ? 45 : 0,
        orientation: isHorizontalLayout ? "right" : "top",
      });
    };

    const mainAxis = buildMainAxisProps({
      angle: isHorizontalLayout ? 0 : -45,
    });
    const crossAxisForStacks = buildCrossAxisForStacks();
    const crossAxisForLines = buildCrossAxisForLines();

    const ChartComponent = ComposedChart;

    const buildBarsProps = () => {
      const dataSource: DataSource = "stacks";

      return pipe(
        stacks,
        (stacks) =>
          stacks.data
            .flatMap((stack) => stack.bars)
            .map((bar) => {
              const builder = new ObjectBuilder<Partial<BarProps>>();

              const barProps = builder
                .add("dataKey", buildDataKey(dataSource, bar.key))
                .add("name", bar.label)
                .add("unit", stacks.yAxisUnitLabel)
                .add("fill", getColorFromPalettes(bar.key, stacks.palettes))
                .add("stackId", "a")
                .add("barSize", 25)
                .add(isHorizontalLayout ? "yAxisId" : "xAxisId", "stacks")
                .get();

              return [buildDataKey(dataSource, bar.key), barProps];
            }),
        Object.fromEntries,
        Object.values
      ) as Partial<BarProps>[];
    };

    const buildLinesProps = () => {
      const dataSource: DataSource = "lines";

      return pipe(
        lines,
        (lines) =>
          lines.map((line, idx) => {
            const builder = new ObjectBuilder<Partial<LineProps>>();

            const dataKey = buildDataKey(dataSource, line.key, idx);
            const lineProps = builder
              .add("dataKey", dataKey)
              .add("name", line.label)
              .add("unit", line.yAxisUnitLabel)
              .add("stroke", getColorFromPalettes(line.key, line.palettes))
              .add("type", "monotone")
              .add(
                isHorizontalLayout ? "yAxisId" : "xAxisId",
                line.useLinesAxis ? "lines" : "stacks"
              )
              .get();

            return [dataKey, lineProps];
          }),
        Object.fromEntries,
        Object.values
      ) as Partial<LineProps>[];
    };

    const barsProps = buildBarsProps();
    const linesProps = buildLinesProps();

    return {
      layout,
      xAxisStacksProps: isHorizontalLayout ? mainAxis : crossAxisForStacks,
      xAxisLinesProps: isHorizontalLayout ? mainAxis : crossAxisForLines,
      yAxisStacksProps: isHorizontalLayout ? crossAxisForStacks : mainAxis,
      yAxisLinesProps: isHorizontalLayout ? crossAxisForLines : mainAxis,
      barsProps,
      linesProps,
      ChartComponent,
    };
  }, [direction, lines, stacks, tick, getColorFromPalettes]);

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
        <chartConfig.ChartComponent
          data={data}
          onClick={onClick}
          layout={chartConfig.layout}
        >
          <XAxis {...(chartConfig.xAxisStacksProps as any)} />
          {chartConfig.xAxisLinesProps && (
            <XAxis {...(chartConfig.xAxisLinesProps as any)} />
          )}
          <YAxis {...(chartConfig.yAxisStacksProps as any)} />
          {chartConfig.yAxisLinesProps && (
            <YAxis {...(chartConfig.yAxisLinesProps as any)} />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {chartConfig.barsProps.map((props, idx) => (
            <Bar key={`${props.dataKey}-${idx}`} {...(props as any)} />
          ))}
          {chartConfig.linesProps.map((props, idx) => (
            <Line key={`${props.dataKey}-${idx}`} {...(props as any)} />
          ))}
        </chartConfig.ChartComponent>
      </ResponsiveContainer>
    </Card>
  );
}
