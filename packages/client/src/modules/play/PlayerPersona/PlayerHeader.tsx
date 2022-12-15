import {
  Box,
  Grid,
  Button,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import GameStepper from "../../common/components/Stepper";
import { IGame, ITeam, IUser } from "../../../utils/types";
import { PlayBox } from "../Components";
import {
  useCurrentStep,
  useMyTeam,
  usePlay,
  usePersona,
} from "../context/playContext";
import { sumAllValues } from "../../persona";
import { Icon } from "../../common/components/Icon";
import {
  formatPoints,
  formatBudget,
  formatCarbonFootprint,
} from "../../../lib/formatter";
import { Typography } from "../../common/components/Typography";
import { RowItem } from "../../common/components/RowItem";
import { useTheme } from "@emotion/react";

export { PlayerHeader, Header, Actions };

function PlayerHeader() {
  const { user } = useAuth();
  const { game } = usePlay();
  const { currentPersona, latestPersona } = usePersona();

  const myTeam = useMyTeam();
  if (user === null) {
    throw new Error("User must be authentified");
  }

  return (
    <Box>
      <PlayBox>
        <Header game={game} team={myTeam || undefined} user={user} />
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
            {formatPoints(currentPersona.points || 0)} <Icon name="trophy" />
          </Typography>

          <RowItem
            sx={{ mt: 1 }}
            left={
              <>
                <Icon name="production" sx={{ mr: 1 }} />
                <Typography sx={{ fontSize: "12px" }}> Production</Typography>
              </>
            }
            right={
              <Typography sx={{ fontSize: "12px" }}>
                {sumAllValues(currentPersona.production) || 0} kWh
              </Typography>
            }
          />
          <RowItem
            sx={{ mt: 1 }}
            left={
              <>
                <Icon name="consumption" sx={{ mr: 1 }} />
                <Typography sx={{ fontSize: "12px" }}> Consommation</Typography>
              </>
            }
            right={
              <Typography sx={{ fontSize: "12px" }}>
                {sumAllValues(currentPersona.consumption) || 0} kWh
              </Typography>
            }
          />
          <RowItem
            sx={{ mt: 1 }}
            left={
              <>
                <Icon name="budget" sx={{ mr: 1 }} />
                <Typography sx={{ fontSize: "12px" }}>
                  Budget restant
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
                  Empreinte carbone
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
              fontSize: "13px",
              border: (theme) =>
                `2px ${theme.palette.primary.contrastText} solid`,
            }}
            component={Link}
            to={`/play/games/${game.id}/persona`}
            variant="contained"
            color="primary"
          >
            <Icon name="badge" sx={{ mr: 1 }} /> Mes caractéristiques
          </Button>
        </Grid>
      </PlayBox>
      <Actions />
    </Box>
  );
}

function Header({
  game,
  team,
  user,
}: {
  game?: IGame;
  team?: ITeam;
  user?: IUser;
}) {
  return (
    <Grid container>
      <Grid item xs={4}>
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
      <Grid item sx={{ pl: 2 }} xs={8}>
        <Typography variant="h6" sx={{ lineBreak: "anywhere" }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>
          {team?.name ?? ""}
        </Typography>
      </Grid>
    </Grid>
  );
}

function Actions() {
  const { game, isStepFinished } = usePlay();
  const currentStep = useCurrentStep();

  const iconName =
    currentStep?.id !== "final-situation"
      ? "videogame-controller"
      : "synthesis";

  return (
    <Box
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
        <Icon name="bar-chart" sx={{ mr: 1 }} /> Statistiques
      </Button>
      <Button
        component={Link}
        to={`/play/games/${game.id}/persona/actions`}
        variant="contained"
        color="primary"
        sx={{
          mt: 2,
          width: "200px",
        }}
        disabled={game.step === 0 || isStepFinished}
      >
        <Icon name={iconName} sx={{ mr: 1 }} />
        {currentStep?.label}
      </Button>
    </Box>
  );
}
