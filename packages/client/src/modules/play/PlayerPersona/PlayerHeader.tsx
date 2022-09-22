import {
  Box,
  Grid,
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActionArea,
  CardContent,
  useTheme,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../auth/authProvider";
import GameStepper from "../../common/components/Stepper";
import { IGame, IGameWithTeams, ITeam, IUser } from "../../../utils/types";
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
          <Typography sx={{ fontSize: "12px", fontWeight: "600" }}>
            {formatPoints(currentPersona.points || 0)} <Icon name="trophy" />
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ml: "auto",
            mr: "auto",
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <Icon name="production" sx={{ mr: 1 }} />{" "}
            {sumAllValues(currentPersona.production) || 0} kWh
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <Icon name="consumption" sx={{ mr: 1 }} />{" "}
            {sumAllValues(currentPersona.consumption) || 0} kWh
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <Icon name="budget" sx={{ mr: 1 }} />{" "}
            {formatBudget(latestPersona.budget || 0)} €/j
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <Icon name="carbon-footprint" sx={{ mr: 1 }} />{" "}
            {formatCarbonFootprint(currentPersona.carbonFootprint || 0)} kg/j
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ml: "auto",
            mr: "auto",
            textAlign: "center",
            mb: 2,
          }}
        >
          <ScoresLegendLayout>
            {
              <Box>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <Icon name="production" sx={{ mr: 1 }} />
                  <br />
                  Production en kiloWattheures
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <Icon name="consumption" sx={{ mr: 1 }} />
                  <br />
                  Consommation en kiloWattheures
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <Icon name="budget" sx={{ mr: 1 }} />
                  <br />
                  Budget en euro à dépenser par jour
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <Icon name="carbon-footprint" sx={{ mr: 1 }} />
                  <br />
                  CO2 produit en kilogrammes par jour
                </Typography>
              </Box>
            }
          </ScoresLegendLayout>
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
  const gameId = useGameId();
  const { game } = usePlay();
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
        to={`/play/games/${gameId}/persona/stats`}
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
        to={`/play/games/${gameId}/persona/actions`}
        variant="contained"
        color="primary"
        sx={{
          mt: 2,
          width: "200px",
        }}
        disabled={isActionButtonDisabled(game)}
      >
        <Icon name={iconName} sx={{ mr: 1 }} />
        {currentStep?.label}
      </Button>
    </Box>
  );
}

function isActionButtonDisabled(game: IGameWithTeams): boolean {
  if (game.isStepActive === false) {
    return true;
  }
  if (game.step === 0) {
    return true;
  }
  return false;
}

function ScoresLegendLayout({ children }: { children: any }) {
  const theme = useTheme();
  return (
    <Accordion
      sx={{
        mb: 2,
        boxShadow: "none",
      }}
    >
      <AccordionSummary
        expandIcon={<Icon name="arrow-forward" />}
        aria-controls="infobh-content"
        id="infobh-header"
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "white",
            position: "absolute",
            ml: "auto",
            mr: "auto",
            transform: "rotate(90deg)",
          },
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(270deg)",
          },
        }}
      ></AccordionSummary>
      <AccordionDetails
        sx={{
          pt: 2,
          bgcolor: theme.palette.primary.main,
          color: "white",
          borderRadius: "5px",
          border: "2px solid white",
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

function useGameId() {
  const { id } = useParams();
  if (!id) throw new Error("game id must be defined");
  const gameId = +id;
  return gameId;
}
