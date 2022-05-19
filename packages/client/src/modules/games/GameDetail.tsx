import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Layout } from "../administration/Layout";
import axios from "axios";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { GameInfo } from "./GameInfo";
import { GamePlayers } from "./GamePlayers";
import AlertDialog from "../dialog/index";

export { GameDetail };

function GameDetail() {
  const params = useParams();

  const { data: result } = useQuery(`/api/games/${params.id}`, () => {
    return axios.get<undefined, { data: { document: any } }>(
      `/api/games/${params.id}`
    );
  });

  const game = result?.data?.document || null;

  return (
    <Layout renderLeftTool={renderLeftTool}>
      <>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Atelier {game?.id}
          </Typography>
          <GeneralInfo game={game} />
          <Players />
          <Preparation />
          <Animation game={game} />
        </Box>
      </>
    </Layout>
  );
}

function renderLeftTool(): JSX.Element {
  return (
    <Button
      component={Link}
      to="/administration/games"
      variant="contained"
      color="inherit"
      sx={{ mr: 2 }}
    >
      <ArrowBackIosNewIcon sx={{ height: "1rem" }} /> Retour
    </Button>
  );
}

function GeneralInfo({ game }: { game: any }) {
  return (
    <AccordionLayout title="Informations générales">
      {game && <GameInfo game={game} />}
    </AccordionLayout>
  );
}

function Players() {
  return (
    <AccordionLayout title="Joueurs">
      <GamePlayers />
    </AccordionLayout>
  );
}

function Preparation() {
  return (
    <AccordionLayout title="Préparation">
      {<Typography>Préparation.</Typography>}
    </AccordionLayout>
  );
}

function Animation({ game }: { game: any }) {
  return (
    <AccordionLayout title="Animation">
      {game && <AnimationActions game={game} />}
    </AccordionLayout>
  );
}

function AccordionLayout({
  children,
  title,
}: {
  children: JSX.Element;
  title: string;
}) {
  return (
    <Accordion
      sx={{
        mb: 2,
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
          },
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
          "& .MuiAccordionSummary-content": {
            color: (theme) => theme.palette.secondary.main,
          },
        }}
      >
        <Typography sx={{ width: "33%", flexShrink: 0 }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 2 }}>{children}</AccordionDetails>
    </Accordion>
  );
}

function AnimationActions() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <AlertDialog gameStatus={"NOT_STARTED"} />
    </Box>
  );
}
