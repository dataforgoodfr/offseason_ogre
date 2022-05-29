import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LunchDiningRoundedIcon from "@mui/icons-material/LunchDiningRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import DryCleaningRoundedIcon from "@mui/icons-material/DryCleaningRounded";

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  SvgIconTypeMap,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { PlayBox } from "../Components";

export { Persona };

function Persona() {
  return (
    <PlayBox>
      <Typography sx={{ textAlign: "center", mb: 2 }} variant="h3">
        Mes caractéristiques
      </Typography>
      <AccordionLayout title="Général" TitleIcon={PersonPinRoundedIcon}>
        <Typography>Caractéristiques.</Typography>
      </AccordionLayout>
      <AccordionLayout title="Déplacement" TitleIcon={DirectionsCarRoundedIcon}>
        <Typography>Caractéristiques.</Typography>
      </AccordionLayout>
      <AccordionLayout title="Logement" TitleIcon={HomeRoundedIcon}>
        <Typography>Caractéristiques.</Typography>
      </AccordionLayout>
      <AccordionLayout title="Alimentation" TitleIcon={LunchDiningRoundedIcon}>
        <Typography>Caractéristiques.</Typography>
      </AccordionLayout>
      <AccordionLayout title="Numérique" TitleIcon={ComputerRoundedIcon}>
        <Typography>Caractéristiques.</Typography>
      </AccordionLayout>
      <AccordionLayout title="Textile" TitleIcon={DryCleaningRoundedIcon}>
        <Typography>Caractéristiques.</Typography>
      </AccordionLayout>
    </PlayBox>
  );
}

function AccordionLayout({
  children,
  title,
  TitleIcon,
}: {
  children: JSX.Element;
  title: string;
  TitleIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
}) {
  const theme = useTheme();

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
        <Typography alignItems="center" display="flex" variant="h6">
          {TitleIcon && <TitleIcon sx={{ mr: 1 }} />}
          {title}
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
