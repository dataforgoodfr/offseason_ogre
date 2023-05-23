import { Card } from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

export { LineEvolution };

const LINE_COLORS = [
  "#6929c4",
  "#1192e8",
  "#005d5d",
  "#9f1853",
  "#fa4d56",
  "#570408",
  "#198038",
  "#002d9c",
  "#ee538b",
  "#b28600",
  "#009d9a",
  "#012749",
  "#8a3800",
  "#a56eff",
];

interface LineEvolutionDatum {
  name: string;
  // Data keys start from `line1`.
  [key: `line${number}`]: { total: number | string; label: string };
}

function LineEvolution({
  data,
  chartMaxHeight,
}: {
  data: LineEvolutionDatum[];
  chartMaxHeight: number;
}) {
  const lineProps = useMemo(() => {
    return Object.entries(data[0] || {})
      .filter(([key, _]) => key !== "name")
      .map(([lineKey, line]) => ({
        dataKey: `${lineKey}.total`,
        name: line.label,
      }));
  }, [data]);

  return (
    <Card
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        p: 2,
      }}
    >
      <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis name="kWh/jour" domain={[0, chartMaxHeight]} />
          <Tooltip />
          <Legend />
          {lineProps.map((props, idx) => (
            <Line
              key={idx}
              dataKey={props.dataKey}
              stroke={LINE_COLORS[idx % lineProps.length]}
              name={props.name}
              unit="kWh/jour"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
