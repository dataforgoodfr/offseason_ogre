import { Link } from "react-router-dom";
import { Grid, Button, Typography } from "@mui/material";
import { CustomContainer } from "./styles/personalization";
import { useGameId } from "./utils";
import { BackArrow } from "./common/BackArrow";
import { AccordionLayout } from "../common/AccordionLayout";

export { PersonalizationForm };

function PersonalizationForm() {
  const gameId = useGameId();

  return (
    <CustomContainer maxWidth="lg">
      <BackArrow />
      <Typography
        variant="h5"
        color="secondary"
        sx={{ textAlign: "center", mb: 4 }}
      >
        Personaliser mon profil
      </Typography>
      <AccordionLayout title="Général" titleIcon="player-pin">
        <Typography> Général </Typography>
      </AccordionLayout>
      <AccordionLayout title="Déplacement" titleIcon="car">
        <Typography> Général </Typography>
      </AccordionLayout>
      <AccordionLayout title="Logement" titleIcon="house">
        <Typography> Général </Typography>
      </AccordionLayout>
      <AccordionLayout title="Alimentation" titleIcon="food">
        <Typography> Général </Typography>
      </AccordionLayout>
      <AccordionLayout title="Numérique" titleIcon="computer">
        <Typography> Général </Typography>
      </AccordionLayout>
      <AccordionLayout title="Textile" titleIcon="clothes">
        <Typography> Général </Typography>
      </AccordionLayout>
    </CustomContainer>
  );
}
