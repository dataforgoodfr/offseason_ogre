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
import range from "lodash/range";

export { LineEvolution };

const LINE_COLORS = ["blue", "orange", "green", "red", "purple", "brown"];

interface LineEvolutionDatum {
  name: string;
  // Data keys start from `line1`.
  [key: `line${number}`]: number | string;
}

function LineEvolution({ data }: { data: LineEvolutionDatum[] }) {
  const lineCount =
    Object.keys(data[0] || {})
      .filter((key) => key.startsWith("line"))
      .map((key) => parseInt(key.replace("line", ""))).length || 0;

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
          <YAxis name="kWh/j" domain={[0, 750]} />
          <Tooltip />
          <Legend />
          {range(0, lineCount).map((idx) => (
            <Line
              key={idx}
              dataKey={`line${idx + 1}`}
              stroke={LINE_COLORS[idx % lineCount]}
              name={`Équipe ${idx + 1}`}
              unit="kWh"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
