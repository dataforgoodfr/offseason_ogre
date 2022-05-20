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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { GameInfo } from "./GameInfo";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

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
  const gameId = useGameId();

  const playersQuery = useQuery(`/api/games/${gameId}/players`, () => {
    return axios.get<undefined, { data: { players: any[] } }>(
      `/api/games/${gameId}/players`
    );
  });
  const teamQueryPath = `/api/teams?${new URLSearchParams({
    gameId: `${gameId}`,
  })}`;
  const teamQuery = useQuery(teamQueryPath, () => {
    return axios.get<undefined, { data: { teams: Team[] } }>(teamQueryPath);
  });

  const queryClient = useQueryClient();
  const changeTeamMutation = useMutation<
    Response,
    { message: string },
    { teamId: number; userId: number }
  >(
    ({ teamId, userId }) => {
      return axios.put("/api/games/change-team", { gameId, teamId, userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
      },
    }
  );

  if (playersQuery.isLoading || teamQuery.isLoading) {
    return <CircularProgress />;
  }

  const players = playersQuery?.data?.data?.players ?? [];
  const teams = teamQuery?.data?.data?.teams ?? [];

  const rows = players.map(({ playedGames, ...player }) => ({
    ...player,
    teamId: playedGames[0].team.id,
  }));

  return (
    <Box style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={buidColumns({ teams })}
        disableSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[10]}
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={(newRow, oldRow) => {
          if (newRow.teamId !== oldRow.teamId) {
            changeTeamMutation.mutate({
              teamId: newRow.teamId,
              userId: newRow.id,
            });
          }
          return newRow;
        }}
      />
    </Box>
  );
}

function buidColumns({ teams }: { teams: Team[] }): GridColDef<{
  name: string;
  firstName: string;
  lastName: string;
  playedGames: { team: { id: number; name: string } }[];
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
      field: "teamId",
      headerName: "Equipe",
      editable: true,
      type: "singleSelect",
      valueOptions: teams.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
      valueFormatter: ({ value, field, api }) => {
        const colDef = api.getColumn(field);
        const option = colDef.valueOptions.find(
          ({ value: optionValue }: { value: any }) => value === optionValue
        );
        return option.label;
      },
      width: 160,
    },
  ];
}

function useGameId() {
  const { id } = useParams();
  if (!id) throw new Error("game id must be defined");
  const gameId = +id;
  return gameId;
}
