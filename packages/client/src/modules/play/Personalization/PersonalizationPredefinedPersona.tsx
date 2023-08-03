import { Box, Grid } from "@mui/material";
import {
  CentralContainer,
  ChoiceText,
  CustomContainer,
} from "./styles/personalization";
import { BackArrow } from "./common/BackArrow";
import { formSections } from "./models/form";
import { useGameId } from "./hooks/useGameId";
import { Accordion } from "../../common/components/Accordion";
import { Icon } from "../../common/components/Icon";
import { Typography } from "../../common/components/Typography";
import { useTranslation } from "../../translations";

export { PersonalizationPredefinedPersona };

function PersonalizationPredefinedPersona() {
  const { t } = useTranslation(["common", "consumption-profiles"]);
  const gameId = useGameId();

  return (
    <CustomContainer maxWidth="lg">
      <BackArrow path={`/play/games/${gameId}/personalize/choice`} />
      <CentralContainer>
        <Grid container direction="row">
          <Grid display="flex" justifyContent="center" item xs={12} sm={2}>
            <img
              style={{ border: "2px solid white", borderRadius: "5px" }}
              src="/avatar_oilgre.png"
              alt="oilgre"
            />
          </Grid>
          <Grid
            display="flex"
            flexDirection="column"
            item
            xs={12}
            sm={10}
            gap={1}
          >
            {t("page.player.personalization.persona.description", {
              returnObjects: true,
            }).map((html) => (
              <ChoiceText
                key={html}
                dangerouslySetInnerHTML={{ __html: html }}
              ></ChoiceText>
            ))}
          </Grid>
        </Grid>
      </CentralContainer>
      <Accordion
        options={Object.entries(formSections).map(([_, value]) => {
          return {
            key: value.name,
            header: (
              <Typography alignItems="center" display="flex" variant="h6">
                {value.titleIcon && (
                  <Icon name={value.titleIcon} sx={{ mr: 1 }} />
                )}
                {t(`consumption-profiles:form.section.${value.name}.title`)}
              </Typography>
            ),
            content: (
              <Box display="flex" flexDirection="column" gap={1}>
                {t(`consumption-profiles:persona.oilgre.${value.name}`, {
                  returnObjects: true,
                }).map((html) => (
                  <Typography
                    key={html}
                    dangerouslySetInnerHTML={{ __html: html }}
                  ></Typography>
                ))}
              </Box>
            ),
          };
        })}
      />
    </CustomContainer>
  );
}
