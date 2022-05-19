import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LunchDiningRoundedIcon from "@mui/icons-material/LunchDiningRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import DryCleaningRoundedIcon from "@mui/icons-material/DryCleaningRounded";

import { theme } from "../../utils/theme";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

export { Persona };

function Persona() {
  return (
    <Box
      sx={{
        mt: 2,
        pl: 2,
        pr: 2,
        pb: 2,
        border: "2px solid white",
        borderRadius: "10px",
        bgcolor: theme.palette.primary.main,
        color: "white",
      }}
    >
      <Typography sx={{ textAlign: "center", mb: 3, mt: 3 }}>
        Mes caractéristiques
      </Typography>
      <AccordionLayout title="Général" titleIcon={<PersonPinRoundedIcon />}>
        {<Typography>Caractéristiques.</Typography>}
      </AccordionLayout>
      <AccordionLayout
        title="Déplacement"
        titleIcon={<DirectionsCarRoundedIcon />}
      >
        {<Typography>Caractéristiques.</Typography>}
      </AccordionLayout>
      <AccordionLayout title="Logement" titleIcon={<HomeRoundedIcon />}>
        {<Typography>Caractéristiques.</Typography>}
      </AccordionLayout>
      <AccordionLayout
        title="Alimentation"
        titleIcon={<LunchDiningRoundedIcon />}
      >
        {<Typography>Caractéristiques.</Typography>}
      </AccordionLayout>
      <AccordionLayout title="Numérique" titleIcon={<ComputerRoundedIcon />}>
        {<Typography>Caractéristiques.</Typography>}
      </AccordionLayout>
      <AccordionLayout title="Textile" titleIcon={<DryCleaningRoundedIcon />}>
        {<Typography>Caractéristiques.</Typography>}
      </AccordionLayout>
    </Box>
  );
}

function AccordionLayout({
  children,
  title,
  titleIcon,
}: {
  children: JSX.Element;
  title: string;
  titleIcon?: JSX.Element;
}) {
  return (
    <Accordion
      sx={{
        mb: 2,
        borderRadius: "5px",
        border: "3px solid #F9C74F",
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowForwardIosIcon />}
        aria-controls="infobh-content"
        id="infobh-header"
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "white",
          },
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
          "& .MuiAccordionSummary-content": {
            color: "white",
          },
        }}
      >
        <Typography sx={{ width: "33%", flexShrink: 0 }}>
          {titleIcon} {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ pt: 2, bgcolor: theme.palette.primary.main, color: "white" }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
