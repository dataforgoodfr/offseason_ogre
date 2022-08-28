import { Box, Button, useTheme, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Persona } from "../../../persona/persona";
import { translateConsumptionName } from "../../../translations";
import { roundValue } from "../../utils";

export { EnergyButtons };

function EnergyButtons({ persona }: { persona: Persona }) {
  const theme = useTheme();

  const energies = [
    {
      color: theme.palette.energy.grey,
      name: "Energies grises (indirectes)",
      type: "grey",
    },
    {
      color: theme.palette.energy.fossil,
      name: "Energies fossiles",
      type: "fossil",
    },
    {
      color: theme.palette.energy.renewable,
      name: "Energies décarbonnées",
      type: "renewable",
    },
    {
      color: theme.palette.energy.mixte,
      name: "Energies mixtes",
      type: "mixte",
    },
  ];

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
                .filter(({ type }) => type === energyTypes.type)
                .map(({ name, value }) => {
                  return `${translateConsumptionName(name)} : ${roundValue(
                    value
                  )} kWh `;
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
