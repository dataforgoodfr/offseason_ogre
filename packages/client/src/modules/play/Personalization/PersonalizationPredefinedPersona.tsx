import { Grid, Typography } from "@mui/material";
import {
  CentralContainer,
  ChoiceText,
  CustomContainer,
} from "./styles/personalization";
import { BackArrow } from "./common/BackArrow";
import { AccordionLayout } from "../common/AccordionLayout";
import { getOilgrePersonaDetails } from "../PlayerPersona/description";

export { PersonalizationPredefinedPersona };

function PersonalizationPredefinedPersona() {
  return (
    <CustomContainer maxWidth="lg">
      <BackArrow />
      <CentralContainer>
        <Grid container direction="row">
          <Grid item xs={12} sm={2}>
            <img
              style={{ border: "2px solid white", borderRadius: "5px" }}
              src="/avatar_oilgre.png"
              alt="oilgre"
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <ChoiceText>
              Les onglets ci-dessous résument les différents aspects de mon mode
              de vie. N'hésite pas à m'incarner si tu n'as pas le temps de créer
              ton profil !
            </ChoiceText>
          </Grid>
        </Grid>
      </CentralContainer>
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
      <AccordionLayout title="Habitudes de consommation" titleIcon="microwave">
        <Typography> {getOilgrePersonaDetails("clothing")} </Typography>
      </AccordionLayout>
    </CustomContainer>
  );
}
