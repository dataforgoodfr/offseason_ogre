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
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import WaterRoundedIcon from "@mui/icons-material/WaterRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import { useAuth } from "../../auth/authProvider";
import GameStepper from "../../common/components/Stepper";
import { IGame, IGameWithTeams, ITeam, IUser } from "../../../utils/types";
import { PlayBox } from "../Components";
import {
  useCurrentStep,
  useMyTeam,
  useResultsByUserId,
  usePlay,
} from "../context/playContext";
import { persona } from "../../persona/persona";
import { sumAllValues } from "../../persona";
import { getLastCompletedStepPlayerValues } from "../utils/playerValues";

export { PlayerHeader, Header, Actions };

function PlayerHeader() {
  const { user } = useAuth();
  const { game } = usePlay();

  const userIds = user && user.id ? [user.id] : [];

  const personaByUserId = useResultsByUserId({ userIds });
  const userPersona = user?.id
    ? getLastCompletedStepPlayerValues(game, personaByUserId[user.id])
    : persona;

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
            {userPersona.points || 0} <EmojiEventsRoundedIcon />
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
            <FactoryRoundedIcon sx={{ mr: 1 }} />{" "}
            {sumAllValues(userPersona.production) || 0} kWh
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <ShoppingCartRoundedIcon sx={{ mr: 1 }} />{" "}
            {sumAllValues(userPersona.consumption) || 0} kWh
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <PaidRoundedIcon sx={{ mr: 1 }} /> {userPersona.budget || 0} €/J
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
            <WaterRoundedIcon sx={{ mr: 1 }} />{" "}
            {userPersona.carbonFootprint || 0} T/an
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
                  <FactoryRoundedIcon sx={{ mr: 1 }} />
                  <br />
                  Production en kiloWattheures
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <ShoppingCartRoundedIcon sx={{ mr: 1 }} />
                  <br />
                  Consommation en kiloWattheures
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <PaidRoundedIcon sx={{ mr: 1 }} />
                  <br />
                  Budget en euro à dépenser par jour
                </Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: "400", mt: 1 }}>
                  <WaterRoundedIcon sx={{ mr: 1 }} />
                  <br />
                  CO2 produit en Tonnes par an
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
        <Typography variant="h6">
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
        <BarChartRoundedIcon sx={{ mr: 1 }} /> Statistiques
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
        <VideogameAssetRoundedIcon sx={{ mr: 1 }} /> {currentStep?.label}
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
        expandIcon={<ArrowForwardIosIcon />}
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
