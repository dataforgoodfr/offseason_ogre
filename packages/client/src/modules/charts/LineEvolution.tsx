import { Card, useTheme } from "@mui/material";
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

export { LineEvolution };

function LineEvolution({ data }: { data: any[] }) {
  const theme = useTheme();
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
          <YAxis name="kWh/j" domain={[0, 1500]} />
          <Tooltip />
          <Legend />
          <Line dataKey="team1" stroke="blue" name="Equipe 1" unit="kWh" />
          <Line dataKey="team2" stroke="orange" name="Equipe 2" unit="kWh" />
          <Line dataKey="team3" stroke="green" name="Equipe 3" unit="kWh" />
          <Line dataKey="team4" stroke="red" name="Equipe 4" unit="kWh" />
          <Line dataKey="team5" stroke="purple" name="Equipe 5" unit="kWh" />
          <Line dataKey="team6" stroke="brown" name="Equipe 6" unit="kWh" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
