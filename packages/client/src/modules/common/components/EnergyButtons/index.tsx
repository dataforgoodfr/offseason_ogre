import { Box, Button, useTheme, Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export { EnergyButtons };

function EnergyButtons({ data }: { data: any[] }) {
  const theme = useTheme();

  const energies = [
    {
      name: "Energies grises (indirectes)",
      color: theme.palette.energy.grey,
      Type: 3,
    },
    { name: "Energies fossiles", color: theme.palette.energy.fossil, Type: 2 },
    {
      name: "Energies décarbonnées",
      color: theme.palette.energy.renewable,
      Type: 1,
    },
    { name: "Energies mixtes", color: theme.palette.energy.mixte, Type: 0 },
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
      {energies.map((item) => (
        <Tooltip
          key={item.Type}
          title={data.map((elm) =>
            elm.Type === item.Type ? `${elm.name} : ${elm.value} kWh - ` : ""
          )}
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
            {item.name} <ArrowForwardIosIcon />
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
}
