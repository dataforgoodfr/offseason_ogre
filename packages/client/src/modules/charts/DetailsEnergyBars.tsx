import { Card, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { EnergyPalette, ProductionPalette } from "../../utils/theme";
import { roundValue } from "../common/utils";
import { ConsumptionDatum } from "../persona/consumption";
import { Persona } from "../persona/persona";
import { ProductionDatum } from "../persona/production";
import { translateName, useTranslation } from "../translations";
import { Typography } from "../common/components/Typography";

export { DetailsEnergyConsumptionBars, DetailsEnergyProductionBars };

function DetailsEnergyConsumptionBars({
  title,
  persona,
}: {
  title?: string;
  persona: Persona;
}) {
  const theme = useTheme();
  return DetailsEnergyBars(
    "consumption",
    persona.consumption,
    theme.palette.energy,
    title
  );
}

function DetailsEnergyProductionBars({
  title,
  persona,
}: {
  title?: string;
  persona: Persona;
}) {
  const theme = useTheme();

  return DetailsEnergyBars(
    "production",
    persona.productionDisplayed,
    theme.palette.production,
    title
  );
}

function DetailsEnergyBars(
  energyType: string,
  personaValues: readonly ConsumptionDatum[] | ProductionDatum[],
  color: EnergyPalette | ProductionPalette,
  title?: string
) {
  const { t } = useTranslation();

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
      }}
    >
      {!!title && (
        <Typography variant="h5" sx={{ mb: 4, textAlign: "center" }}>
          {title}
        </Typography>
      )}
      <BarChart
        width={500}
        height={550}
        data={personaValues.map((item) => ({
          ...item,
          value: roundValue(item.value),
          name: translateName(energyType, item.name),
        }))}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[0, 50]}
          unit={t("unit.watthour-per-day-bare.kilo")}
        />
        <YAxis
          type="category"
          width={160}
          style={{ marginTop: "5px", fontSize: "11px" }}
          dataKey="name"
          {...{ angle: -45 }}
        />
        <Tooltip />
        <Bar dataKey="value" unit={t("unit.watthour-per-day-bare.kilo")}>
          {personaValues.map(({ name, type }) => {
            return (
              <Cell
                key={`cell-${name}`}
                fill={(color as any)[type] || "blue"}
              />
            );
          })}
        </Bar>
      </BarChart>
    </Card>
  );
}
