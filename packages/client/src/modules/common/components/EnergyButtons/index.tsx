import { Box, Button, useTheme, Tooltip } from "@mui/material";
import { useMemo } from "react";
import { Persona } from "../../../persona/persona";
import { translateName, useTranslation } from "../../../translations";
import { roundValue } from "../../utils";
import { Icon } from "../Icon";

export { EnergyConsumptionButtons, EnergyProductionButtons };

function EnergyConsumptionButtons({ persona }: { persona: Persona }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const items: EnergyItem[] = useMemo((): EnergyItem[] => {
    const energyTypesDisplayed = new Set(
      persona.consumption.map((datum) => datum.type)
    );

    const energies = [
      {
        color: theme.palette.energy.grey,
        name: t("energy.grey"),
        type: "grey",
      },
      {
        color: theme.palette.energy.fossil,
        name: t("energy.fossil"),
        type: "fossil",
      },
      {
        color: theme.palette.energy.renewable,
        name: t("energy.renewable"),
        type: "renewable",
      },
      {
        color: theme.palette.energy.mixte,
        name: t("energy.mixte"),
        type: "mixte",
      },
    ] as const;

    return energies
      .filter((energy) => energyTypesDisplayed.has(energy.type))
      .map((energy) => {
        const details = persona.consumption
          .filter(({ type }) => type === energy.type)
          .map(
            ({ name, value }) =>
              `${translateName("consumption", name)} : ${t(
                "unit.watthour-per-day.kilo",
                {
                  value: roundValue(value),
                }
              )}`
          )
          .join("\n");

        return {
          name: energy.name,
          color: energy.color,
          details,
        };
      });
  }, [persona.consumption, theme, t]);

  return <EnergyButtons items={items} />;
}

function EnergyProductionButtons({ persona }: { persona: Persona }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const items: EnergyItem[] = useMemo((): EnergyItem[] => {
    const energyTypesDisplayed = new Set(
      persona.productionDisplayed.map((datum) => datum.type)
    );

    const energies = [
      {
        color: theme.palette.production.offshore,
        name: t("graph.energy.offshore"),
        type: "offshore",
      },
      {
        color: theme.palette.production.terrestrial,
        name: t("graph.energy.terrestrial"),
        type: "terrestrial",
      },
      {
        color: theme.palette.production.nuclear,
        name: t("graph.energy.nuclear"),
        type: "nuclear",
      },
    ] as const;

    return energies
      .filter((energy) => energyTypesDisplayed.has(energy.type))
      .map((energy) => {
        const details = persona.productionDisplayed
          .filter(({ type }) => type === energy.type)
          .map(
            ({ name, value }) =>
              `${translateName("production", name)} : ${t(
                "unit.watthour-per-day.kilo",
                {
                  value: roundValue(value),
                }
              )}`
          )
          .join("\n");

        return {
          name: energy.name,
          color: energy.color,
          details,
        };
      });
  }, [persona.productionDisplayed, theme, t]);

  return <EnergyButtons items={items} />;
}

interface EnergyItem {
  name: string;
  details: string;
  color: string;
}

function EnergyButtons({ items }: { items: EnergyItem[] }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
      }}
    >
      {items.map((item) => (
        <Tooltip
          key={item.name}
          title={<div style={{ whiteSpace: "pre-line" }}>{item.details}</div>}
          arrow
        >
          <Button
            key={item.name}
            variant="contained"
            sx={{
              bgcolor: item.color,
              "&:hover": {
                backgroundColor: item.color,
                filter: "brightness(85%)",
              },
              color: "white",
              width: "50%",
              m: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {item.name} <Icon name="arrow-forward" />
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
}
