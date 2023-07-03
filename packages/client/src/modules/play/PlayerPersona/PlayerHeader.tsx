import {
  Box,
  Grid,
  Button,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import GameStepper from "../../common/components/Stepper";
import { IGame, ITeam, IUser } from "../../../utils/types";
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

export { PlayerHeader, Header, Actions };

function PlayerHeader() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { game } = usePlay();
  const { currentPersona, latestPersona } = usePersona();
  const { teamValues } = useTeamValues();
  const teamIdToTeamValues = Object.fromEntries(
    teamValues.map((value) => [value.id, value])
  );

  const { team: myTeam } = useCurrentPlayer();
  if (user === null) {
    throw new Error("User must be authentified");
  }

  const playerPoints = myTeam ? teamIdToTeamValues[myTeam.id]?.points || 0 : 0;

  return (
    <Box className="player-header">
      <PlayBox className="player-header__profile">
        <Header
          className="player-header__profile__header"
          game={game}
          team={myTeam || undefined}
          user={user}
        />
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
                {sumAllValues(currentPersona.production) || 0} kWh/jour
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
                {sumAllValues(currentPersona.consumption) || 0} kWh/jour
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
                {formatBudget(latestPersona.budget || 0)} €/j
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
                {formatCarbonFootprint(currentPersona.carbonFootprint || 0)}{" "}
                kg/j
              </Typography>
            }
          />
          <Button
            sx={{
              mt: 2,
              mb: 1,
              width: "200px",
            }}
            component={Link}
            to={`/play/games/${game.id}/persona`}
            variant="contained"
            color="secondary"
          >
            <Icon name="badge" sx={{ mr: 1 }} />{" "}
            {t("cta.go-to-player-characteristics")}
          </Button>
        </Grid>
      </PlayBox>
      <Actions className="player-header__actions" />
    </Box>
  );
}

function Header({
  game,
  team,
  user,
  className,
}: {
  game?: IGame;
  team?: ITeam;
  user?: IUser;
  className?: string;
}) {
  const theme = useTheme();
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

  const iconName =
    currentStep?.id !== "final-situation"
      ? "videogame-controller"
      : "synthesis";

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Button
        component={Link}
        to={`/play/games/${game.id}/persona/stats`}
        variant="contained"
        color="secondary"
        sx={{
          width: "200px",
        }}
      >
        <Icon name="bar-chart" sx={{ mr: 1 }} />{" "}
        {t("cta.go-to-player-statistics")}
      </Button>
      <Button
        component={Link}
        to={`/play/games/${game.id}/persona/actions`}
        variant="contained"
        color="secondary"
        sx={{
          mt: 2,
          width: "200px",
        }}
        disabled={
          !game.isGameFinished && (game.step === 0 || game.isStepFinished)
        }
      >
        <Icon name={iconName} sx={{ mr: 1 }} />
        {t(`cta.go-to-step.${currentStep?.id}` as any)}
      </Button>
    </Box>
  );
}
