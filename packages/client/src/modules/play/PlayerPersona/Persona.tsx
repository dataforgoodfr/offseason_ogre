import { Typography } from "@mui/material";
import { PlayBox } from "../Components";
import { getOilgrePersonaDetails } from "./description";
import { AccordionLayout } from "../common/AccordionLayout";

export { Persona };

function Persona() {
  return (
    <PlayBox>
      <Typography sx={{ textAlign: "center", mb: 2 }} variant="h3">
        Mes caractéristiques
      </Typography>
      <AccordionLayout title="Général" titleIcon="player-pin">
        <Typography> {getOilgrePersonaDetails("general")} </Typography>
      </AccordionLayout>
      <AccordionLayout title="Déplacement" titleIcon="car">
        <Typography> {getOilgrePersonaDetails("travel")} </Typography>
      </AccordionLayout>
      <AccordionLayout title="Logement" titleIcon="house">
        <Typography> {getOilgrePersonaDetails("housing")} </Typography>
      </AccordionLayout>
      <AccordionLayout title="Alimentation" titleIcon="food">
        <Typography> {getOilgrePersonaDetails("food")} </Typography>
      </AccordionLayout>
      <AccordionLayout title="Numérique" titleIcon="computer">
        <Typography> {getOilgrePersonaDetails("numeric")} </Typography>
      </AccordionLayout>
      <AccordionLayout title="Textile" titleIcon="clothes">
        <Typography> {getOilgrePersonaDetails("clothing")} </Typography>
      </AccordionLayout>
    </PlayBox>
  );
}
