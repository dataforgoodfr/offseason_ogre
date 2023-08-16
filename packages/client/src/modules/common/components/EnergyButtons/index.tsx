import { Box, Button, useTheme, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useMemo } from "react";
import { Persona } from "../../../persona/persona";
import {
  I18nTranslateFunction,
  translateName,
  useTranslation,
} from "../../../translations";
import { roundValue } from "../../utils";

export { EnergyConsumptionButtons, EnergyProductionButtons };

interface EnergyType {
  color: string;
  name: string;
  type: string;
}

function EnergyConsumptionButtons({ persona }: { persona: Persona }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const energies: EnergyType[] = [
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
  ];

  return buildEnergyConsumptionButtons("consumption", energies, persona, t);
}

function buildEnergyConsumptionButtons(
  stepType: string,
  energies: EnergyType[],
  persona: Persona,
  t: I18nTranslateFunction
) {
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
      {energies.map((energyTypes) => (
        <Tooltip
          key={energyTypes.type}
          title={
            <div style={{ whiteSpace: "pre-line" }}>
              {persona.consumption
                .filter(
                  ({ type }: { type: string }) => type === energyTypes.type
                )
                .map(({ name, value }: { name: string; value: number }) => {
                  return `${translateName(stepType, name)} : ${t(
                    "unit.watthour-per-day.kilo",
                    {
                      value: roundValue(value),
                    }
                  )}`;
                })
                .join("\n")}
            </div>
          }
          arrow
        >
          <Button
            key={energyTypes.name}
            variant="contained"
            sx={{
              bgcolor: energyTypes.color,
              "&:hover": {
                backgroundColor: energyTypes.color,
                filter: "brightness(85%)",
              },
              color: "white",
              width: "50%",
              m: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {energyTypes.name} <ArrowForwardIosIcon />
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
}

function EnergyProductionButtons({ persona }: { persona: Persona }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const energiesDisplayed: EnergyType[] = useMemo(() => {
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

    return energies.filter((energy) => energyTypesDisplayed.has(energy.type));
  }, [persona.productionDisplayed, theme, t]);

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
      {energiesDisplayed.map((energy) => (
        <Tooltip
          key={energy.type}
          title={
            <div style={{ whiteSpace: "pre-line" }}>
              {persona.productionDisplayed
                .filter(({ type }) => type === energy.type)
                .map(({ name, value }) => {
                  return `${translateName("production", name)} : ${t(
                    "unit.watthour-per-day.kilo",
                    {
                      value: roundValue(value),
                    }
                  )}`;
                })
                .join("\n")}
            </div>
          }
          arrow
        >
          <Button
            key={energy.name}
            variant="contained"
            sx={{
              bgcolor: energy.color,
              "&:hover": {
                backgroundColor: energy.color,
                filter: "brightness(85%)",
              },
              color: "white",
              width: "50%",
              m: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {energy.name} <ArrowForwardIosIcon />
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
}
