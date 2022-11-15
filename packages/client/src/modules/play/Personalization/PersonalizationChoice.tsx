import { Link } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import {
  CustomContainer,
  CentralContainer,
  ChoiceText,
  ChoiceButton,
} from "./styles/personalization";
import { Icon } from "../../common/components/Icon";
import { useGameId } from "./utils";
import { BackArrow } from "./common/BackArrow";

export { PersonalizationChoice };

function PersonalizationChoice() {
  const gameId = useGameId();

  return (
    <CustomContainer maxWidth="lg">
      <BackArrow />
      <Typography variant="h5" color="secondary" sx={{ textAlign: "center" }}>
        Préparer l'atelier
      </Typography>
      <CentralContainer>
        <Grid container direction="row">
          <Grid item xs={12} sm={2}>
            <img
              style={{ border: "2px solid white", borderRadius: "5px" }}
              src="/sage.png"
              alt="sage"
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <ChoiceText>
              Pour une expérience personnalisée, je te propose de remplir un
              formulaire afin de bâtir ton profil de consommation personnalisé.
              Cela ne te prendra que quelques minutes. Si le formulaire n'est
              pas complété et transmis à l'animateur, tu joueras avec le persona
              Oil'gre.
            </ChoiceText>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          sx={{ mt: 4 }}
        >
          <Grid item sx={{ textAlign: "center" }} xs={12} sm={6}>
            <ChoiceButton
              component={Link}
              color="secondary"
              variant="contained"
              to={`/play/games/${gameId}/personalize/form`}
            >
              <Icon name="player-add" sx={{ mr: 1 }} />
              <br />
              <Typography>Créer mon profil conso</Typography>
            </ChoiceButton>
          </Grid>
          <Grid item sx={{ textAlign: "center" }} xs={12} sm={6}>
            <ChoiceButton
              color="secondary"
              variant="contained"
              component="a"
              target="_blank"
              href="https://drive.google.com/file/d/1o8og6uawrINEJKj55vndLjxSnHBTO731/view?usp=sharing"
            >
              <img
                style={{
                  height: "32px",
                  marginLeft: "2%",
                  marginRight: "2%",
                  borderRadius: "5px",
                }}
                src="/avatar.png"
                alt="avatar"
              />
              <Typography>Voir le persona Oil'gre</Typography>
            </ChoiceButton>
          </Grid>
        </Grid>
      </CentralContainer>
    </CustomContainer>
  );
}