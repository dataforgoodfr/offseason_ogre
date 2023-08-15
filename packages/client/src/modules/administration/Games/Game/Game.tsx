import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { GameInfo } from "./GameInfo";
import { IGame } from "../../../../utils/types";
import { ITeamWithPlayers } from "../../../../utils/types";
import { GamePlayers } from "./GamePlayers";
import { Animation } from "./Animation";
import { GameTeams } from "./GameTeams";
import { http } from "../../../../utils/request";
import { Tag } from "../../../common/components/Tag";
import { useTranslation } from "../../../translations";

export { Game };

type IGameWithTeams = IGame & { teams: ITeamWithPlayers[] };

function Game() {
  const { t } = useTranslation();
  const params = useParams();

  const { data: result } = useQuery(`/api/games/${params.id}`, () => {
    return http.get<undefined, { data: { document: any } }>(
      `/api/games/${params.id}`
    );
  });

  const game = result?.data?.document || null;

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
          {game?.isTest && (
            <Tag type="secondary">{t("game.mode.test").toUpperCase()}</Tag>
          )}
          <Typography variant="h3">Atelier {game?.code}</Typography>
        </Box>
        <GeneralInfo game={game} />
        <Players game={game} />
        <Preparation game={game} />
        <AnimationAccordion game={game} />
      </Box>
    </>
  );
}

function GeneralInfo({ game }: { game: IGame }) {
  return (
    <AccordionLayout title="Informations générales">
      {game && <GameInfo game={game} />}
    </AccordionLayout>
  );
}

function Players({ game }: { game: IGame }) {
  return (
    <AccordionLayout title="Joueurs">
      {game && <GamePlayers game={game} />}
    </AccordionLayout>
  );
}

function Preparation({ game }: { game: IGame }) {
  return (
    <AccordionLayout title="Préparation">
      {game && <GameTeams game={game} />}
    </AccordionLayout>
  );
}

function AnimationAccordion({ game }: { game: IGameWithTeams }) {
  return (
    <AccordionLayout title="Animation">
      {game && <Animation game={game} />}
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
