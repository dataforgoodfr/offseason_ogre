import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import GameStepper from "../../common/components/Stepper";
import { PlayBox } from "../Components";
import { useCurrentStep, usePlay, useTeamValues } from "../context/playContext";
import { sumAllValues } from "../../persona";
import { Icon } from "../../common/components/Icon";
import {
  formatPoints,
  formatBudget,
  formatCarbonFootprint,
} from "../../../lib/formatter";
import { Typography } from "../../common/components/Typography";
import { RowItem } from "../../common/components/RowItem";
import { useTranslation } from "../../translations/useTranslation";
import { useCurrentPlayer, usePersona } from "../context/hooks/player";
import { Button } from "../../common/components/Button";
import { useMemo } from "react";

export { PlayerHeader };

function PlayerHeader() {
  const { t } = useTranslation(["common", "countries"]);
  const { game } = usePlay();
  const { currentPersona, latestPersona } = usePersona();
  const { teamValues } = useTeamValues();
  const { team } = useCurrentPlayer();

  const teamIdToTeamValues = useMemo(() => {
    return Object.fromEntries(teamValues.map((value) => [value.id, value]));
  }, [teamValues]);

  const playerPoints = useMemo(
    () => (team ? teamIdToTeamValues[team.id]?.points || 0 : 0),
    [team, teamIdToTeamValues]
  );

  return (
    <Box
      className="player-header"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <PlayBox className="player-header__profile">
        <Header className="player-header__profile__header" />
        <Grid
          item
          xs={12}
          sx={{
            ml: "auto",
            mr: "auto",
            mt: 2,
            textAlign: "center",
          }}
        >
          <GameStepper step={game.step} />
        </Grid>
        <Grid
          display="flex"
          flexDirection="column"
          gap={2}
          item
          xs={12}
          sx={{
            ml: "auto",
            mr: "auto",
            pt: 2,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
            {formatPoints(playerPoints)} <Icon name="trophy" />
          </Typography>

          <Box>
            <RowItem
              sx={{ mt: 1 }}
              left={
                <>
                  <Icon name="production" sx={{ mr: 1 }} />
                  <Typography sx={{ fontSize: "12px" }}>
                    {t("player.profile.summary.production")}
                  </Typography>
                </>
              }
              right={
                <Typography sx={{ fontSize: "12px" }}>
                  {t("unit.watthour-per-day.kilo", {
                    value: sumAllValues(currentPersona.production) || 0,
                  })}
                </Typography>
              }
            />
            <RowItem
              sx={{ mt: 1 }}
              left={
                <>
                  <Icon name="consumption" sx={{ mr: 1 }} />
                  <Typography sx={{ fontSize: "12px" }}>
                    {t("player.profile.summary.consumption")}
                  </Typography>
                </>
              }
              right={
                <Typography sx={{ fontSize: "12px" }}>
                  {t("unit.watthour-per-day.kilo", {
                    value: sumAllValues(currentPersona.consumption) || 0,
                  })}
                </Typography>
              }
            />
            <RowItem
              sx={{ mt: 1 }}
              left={
                <>
                  <Icon name="budget" sx={{ mr: 1 }} />
                  <Typography sx={{ fontSize: "12px" }}>
                    {t("player.profile.summary.remaining-budget")}
                  </Typography>
                </>
              }
              right={
                <Typography sx={{ fontSize: "12px" }}>
                  {t("unit.budget-per-day.base", {
                    value: formatBudget(latestPersona.budget || 0),
                    symbol: t("countries:country.fr.currency.symbol"),
                  })}
                </Typography>
              }
            />
            <RowItem
              sx={{ mt: 1 }}
              left={
                <>
                  <Icon name="carbon-footprint" sx={{ mr: 1 }} />
                  <Typography sx={{ fontSize: "12px" }}>
                    {t("player.profile.summary.carbon-footprint")}
                  </Typography>
                </>
              }
              right={
                <Typography sx={{ fontSize: "12px" }}>
                  {t("unit.carbon-per-day.kilo", {
                    value: formatCarbonFootprint(
                      currentPersona.carbonFootprint || 0
                    ),
                  })}
                </Typography>
              }
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
          >
            <Button
              iconName="badge"
              width={200}
              to={`/play/games/${game.id}/persona`}
            >
              {t("cta.go-to-player-characteristics")}
            </Button>
          </Box>
        </Grid>
      </PlayBox>
      <Actions className="player-header__actions" />
    </Box>
  );
}

function Header({ className }: { className?: string }) {
  const theme = useTheme();
  const { user } = useAuth();
  const { game } = usePlay();
  const { team } = useCurrentPlayer();

  return (
    <Grid className={className} display="grid" gridTemplateColumns="1fr 3fr">
      <Grid maxWidth={150}>
        <Card>
          <CardActionArea
            to={`/play/games/${game?.id}/persona`}
            component={Link}
          >
            <CardContent sx={{ p: 0 }}>
              <img
                style={{ border: "2px solid white", borderRadius: "5px" }}
                src="/avatar.png"
                alt="avatar"
              />
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid sx={{ pl: 2 }}>
        <Typography variant="h6" sx={{ lineBreak: "anywhere" }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Box display="flex" alignItems="flex-end">
          <Icon
            name="team"
            sx={{ color: theme.palette.primary.contrastText, mr: 1 }}
          />
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: "400",
              color: theme.palette.primary.contrastText,
            }}
          >
            {team?.name ?? ""}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

function Actions({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { game } = usePlay();
  const currentStep = useCurrentStep();

  const iconName = useMemo(() => {
    return currentStep?.id !== "final-situation"
      ? "videogame-controller"
      : "synthesis";
  }, [currentStep]);

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Button
        iconName="bar-chart"
        width={200}
        to={`/play/games/${game.id}/persona/stats`}
      >
        {t("cta.go-to-player-statistics")}
      </Button>
      <Button
        iconName={iconName}
        width={200}
        to={`/play/games/${game.id}/persona/actions`}
        disabled={
          !game.isGameFinished && (game.step === 0 || game.isStepFinished)
        }
      >
        {t(`cta.go-to-step.${currentStep?.id}` as any)}
      </Button>
    </Box>
  );
}
