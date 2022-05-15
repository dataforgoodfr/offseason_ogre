import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Layout } from "../administration/Layout";
import axios from "axios";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { theme } from "../../utils/theme";
import { GameInfo } from "./GameInfo";

export const AccordionSummary = styled(MuiAccordionSummary)(() => ({
  backgroundColor: theme.palette.primary.main,
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: "white",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    color: theme.palette.secondary.main,
  },
}));

export const Accordion = styled(MuiAccordion)(() => ({
  marginBottom: "2%",
}));

export { GameDetail };

function GameDetail() {
  const [expanded, setExpanded] = useState<string[]>(["info"]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      isExpanded
        ? setExpanded((expanded: string[]) => [...expanded, panel])
        : setExpanded(expanded.filter((value) => value !== panel));
    };

  const params = useParams();

  const { data: result } = useQuery("game", () => {
    return axios.get<undefined, { data: { document: any } }>(
      `/api/games/${params.id}`
    );
  });

  const game = result?.data?.document || null;

  return (
    <Layout>
      <>
        <Button
          component={Link}
          to="/games"
          variant="contained"
          color="secondary"
          sx={{ mb: 2 }}
        >
          <ArrowBackIosNewIcon sx={{ height: "1rem" }} /> Retour
        </Button>
        <Typography variant="h3"> Atelier {game?.id} </Typography>
        <Box sx={{ mt: 2, pl: 10, pr: 10 }}>
          <GeneralInfo game={game} />
          <Accordion
            expanded={expanded.indexOf("players") > -1}
            onChange={handleChange("players")}
          >
            <AccordionSummary
              expandIcon={<ArrowForwardIosIcon />}
              aria-controls="playersbh-content"
              id="playersbh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Joueurs
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Joueurs.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded.indexOf("prepare") > -1}
            onChange={handleChange("prepare")}
          >
            <AccordionSummary
              expandIcon={<ArrowForwardIosIcon />}
              aria-controls="preparebh-content"
              id="preparebh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Préparer l'atelier
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Préparation de l'atelier.</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded.indexOf("animation") > -1}
            onChange={handleChange("animation")}
          >
            <AccordionSummary
              expandIcon={<ArrowForwardIosIcon />}
              aria-controls="animationbh-content"
              id="animationbh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                Animer l'atelier
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Animation de l'atelier.</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </>
    </Layout>
  );
}

function GeneralInfo({ game }: { game: any }) {
  return (
    <AccordionLayout title="General Info">
      {game && <GameInfo game={game} />}
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
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowForwardIosIcon />}
        aria-controls="infobh-content"
        id="infobh-header"
      >
        <Typography sx={{ width: "33%", flexShrink: 0 }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
