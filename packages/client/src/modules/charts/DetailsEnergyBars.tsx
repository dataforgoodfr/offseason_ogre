import { Card } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

export { DetailsEnergyBars };

function DetailsEnergyBars({ data }: { data: any[] }) {
  const colors = ["#F9C74F", "#84BDF0", "#AF6A28", "Grey"];
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
      }}
    >
      <BarChart
        width={500}
        height={550}
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit="kWh" />
        <YAxis type="category" width={160} dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" unit="kWh">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.Type]} />
          ))}
        </Bar>
      </BarChart>
    </Card>
  );
}
