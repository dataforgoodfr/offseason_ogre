
import { Box, Button, useTheme } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export { EnergyButtons }

function EnergyButtons() {

    const theme = useTheme()

    const energies = [
        { name: "Energies grises (indirectes)", color: theme.palette.energy.grey },
        { name: "Energies fossiles", color: theme.palette.energy.fossile },
        { name: "Energies décarbonnées", color: theme.palette.energy.renewable },
        { name: "Energies mixtes", color: theme.palette.energy.mixte },
    ]

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            {
                energies.map(item => <Button variant="contained" sx={{ bgcolor: item.color, color: "white", width: "50%", m: 1, display: "flex", justifyContent: "space-between" }}>{item.name} <ArrowForwardIosIcon /></Button>)
            }
        </Box>
    )
}



