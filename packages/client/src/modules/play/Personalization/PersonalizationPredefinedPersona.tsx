import { Grid, Typography } from "@mui/material";
import {
  CentralContainer,
  ChoiceText,
  CustomContainer,
} from "./styles/personalization";
import { BackArrow } from "./common/BackArrow";
import { getOilgrePersonaDetails } from "../PlayerPersona/description";
import { formSections } from "./models/form";
import { useGameId } from "./hooks/useGameId";
import { Accordion } from "../../common/components/Accordion";
import { Icon } from "../../common/components/Icon";

export { PersonalizationPredefinedPersona };

function PersonalizationPredefinedPersona() {
  const gameId = useGameId();

  return (
    <CustomContainer maxWidth="lg">
      <BackArrow path={`/play/games/${gameId}/personalize/choice`} />
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
      <Accordion
        options={Object.entries(formSections).map(
          ([_, value]: [string, any]) => {
            return {
              key: value.name,
              header: (
                <Typography alignItems="center" display="flex" variant="h6">
                  {value.titleIcon && (
                    <Icon name={value.titleIcon} sx={{ mr: 1 }} />
                  )}
                  {value.title}
                </Typography>
              ),
              content: getOilgrePersonaDetails(value.name),
              themeVariation: "orange",
            };
          }
        )}
      />
    </CustomContainer>
  );
}
