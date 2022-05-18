import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Layout } from "../administration/Layout";
import axios from "axios";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { GameInfo } from "./GameInfo";
import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  MuiEvent,
} from "@mui/x-data-grid";

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
          <Animation />
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
      <PlayersDataGrid />
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

function Animation() {
  return (
    <AccordionLayout title="Animation">
      {<Typography>Animation.</Typography>}
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

interface Team {
  id: number;
  gameId: number;
  name: string;
}

function PlayersDataGrid() {
  const params = useParams();
  const gameId = params.id;
  if (!gameId) throw new Error("game id must be defined");

  const playersQuery = useQuery(`/api/games/${gameId}/players`, () => {
    return axios.get<undefined, { data: { players: any[] } }>(
      `/api/games/${gameId}/players`
    );
  });
  const teamQueryPath = `/api/teams?${new URLSearchParams({ gameId })}`;
  const teamQuery = useQuery(teamQueryPath, () => {
    return axios.get<undefined, { data: { teams: Team[] } }>(teamQueryPath);
  });

  if (playersQuery.isLoading || teamQuery.isLoading) {
    return <CircularProgress />;
  }

  const rows = playersQuery?.data?.data?.players ?? [];
  const teams = teamQuery?.data?.data?.teams ?? [];

  return (
    <Box style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={buidColumns({ teams })}
        disableSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[10]}
        experimentalFeatures={{ newEditingApi: true }}
        onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
          if (params.field === "team") {
            const newTeamName = params.value;
            console.log("newTeamName", newTeamName);
            return;
          }
        }}
      />
    </Box>
  );
}

function buidColumns({ teams }: { teams: Team[] }): GridColDef<{
  name: string;
  firstName: string;
  lastName: string;
  playedGames: { team: { name: string } }[];
}>[] {
  return [
    {
      field: "name",
      headerName: "Nom",
      valueGetter: (params) => {
        const row = params.row;
        return row.firstName + " " + row.lastName;
      },
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "team",
      headerName: "Equipe",
      editable: true,
      valueGetter: (params) => {
        const row = params.row;
        return row.playedGames[0].team.name;
      },
      type: "singleSelect",
      valueOptions: teams.map(({ name }) => name),
      width: 160,
    },
  ];
}
