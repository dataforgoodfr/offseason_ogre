import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import {
  CustomContainer,
  CentralContainer,
  ChoiceText,
  ChoiceButton,
  Title,
} from "./styles/personalization";
import { Icon } from "../../common/components/Icon";
import { useGameId } from "./hooks/useGameId";
import { BackArrow } from "./common/BackArrow";
import { useQuery } from "react-query";
import { ErrorAlert } from "../../alert";
import { formBlockText } from "./utils/formValidation";
import { http } from "../../../utils/request";
import { Typography } from "../../common/components/Typography";
import { useTranslation } from "../../translations";

export { PersonalizationChoice };

function PersonalizationChoice() {
  const { t } = useTranslation();
  const gameId = useGameId();

  const query = useQuery(`/api/games/${gameId}`, () => {
    return http.get<undefined, { data: { document: any } }>(
      `/api/games/${gameId}`
    );
  });
  const game = useMemo(() => query?.data?.data?.document || null, [query]);

  return (
    <CustomContainer maxWidth="lg">
      {game?.status && game.status !== "draft" && (
        <ErrorAlert alertPosition="top" message={formBlockText} />
      )}
      <Box display="flex" flexDirection="column" gap={3}>
        <Box>
          <BackArrow path={`/play/games/`} />
        </Box>
        <Title variant="h3">{t("page.player.personalization.title")}</Title>
      </Box>
      <CentralContainer>
        <Grid container direction="row">
          <Grid item xs={12} sm={2}>
            <img
              style={{ border: "2px solid white", borderRadius: "5px" }}
              src="/sage.png"
              alt="sage"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={10}
            display="flex"
            flexDirection="column"
            gap={1}
          >
            {t("page.player.personalization.description", {
              returnObjects: true,
            }).map((text) => (
              <ChoiceText key={text}>{text}</ChoiceText>
            ))}
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          sx={{ mt: 4 }}
        >
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              pt: 4,
              pb: 2,
              pr: 5,
              pl: 5,
            }}
            xs={12}
            sm={6}
          >
            <ChoiceButton
              disabled={query.isLoading || (game && game?.status !== "draft")}
              to={`/play/games/${gameId}/personalize/form`}
            >
              <Box
                component="span"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Icon name="player-add" sx={{ mr: 1 }} />
                <Typography>{t("cta.create-profile")}</Typography>
              </Box>
            </ChoiceButton>
          </Grid>
          <Grid
            item
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              pt: 4,
              pb: 2,
              pr: 5,
              pl: 5,
            }}
            xs={12}
            sm={6}
          >
            <ChoiceButton to={`/play/games/${gameId}/personalize/oilgre`}>
              <Box
                component="span"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <img
                  style={{
                    height: "32px",
                    marginLeft: "10px",
                    marginRight: "10px",
                    borderRadius: "5px",
                  }}
                  src="/avatar.png"
                  alt="avatar"
                />
                <Typography>{t("cta.read-profile-oilgre")}</Typography>
              </Box>
            </ChoiceButton>
          </Grid>
        </Grid>
      </CentralContainer>
    </CustomContainer>
  );
}
