import { Box, Button, useTheme, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Persona } from "../../../persona/persona";

export { EnergyButtons };

function EnergyButtons({ persona }: { persona: Persona }) {
  const theme = useTheme();

  const energies = [
    {
      color: theme.palette.energy.grey,
      name: "Energies grises (indirectes)",
      type: "greyEnergy",
    },
    {
      color: theme.palette.energy.fossil,
      name: "Energies fossiles",
      type: "fossilEnergy",
    },
    {
      color: theme.palette.energy.renewable,
      name: "Energies décarbonnées",
      type: "renewableEnergy",
    },
    {
      color: theme.palette.energy.mixte,
      name: "Energies mixtes",
      type: "mixteEnergy",
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
                  return `${name} : ${value} kWh `;
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
