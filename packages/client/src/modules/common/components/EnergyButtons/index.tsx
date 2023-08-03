import { Box, Button, useTheme, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Persona } from "../../../persona/persona";
import {
  I18nTranslateFunction,
  translateName,
  useTranslation,
} from "../../../translations";
import { hasNuclear, roundValue } from "../../utils";
import { usePlay } from "../../../play/context/playContext";

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

  return buildEnergyButtons("consumption", energies, persona, t);
}

function EnergyProductionButtons({ persona }: { persona: Persona }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { game } = usePlay();

  const energies: EnergyType[] = [
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
  ];

  if (hasNuclear(game)) {
    energies.push({
      color: theme.palette.production.nuclear,
      name: t("graph.energy.nuclear"),
      type: "nuclear",
    });
  }

  return buildEnergyButtons("production", energies, persona, t);
}

function buildEnergyButtons(
  stepType: string,
  energies: EnergyType[],
  persona: Persona,
  t: I18nTranslateFunction
) {
  const personaValues: any =
    stepType === "consumption" ? persona.consumption : persona.production;

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
              {personaValues
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
