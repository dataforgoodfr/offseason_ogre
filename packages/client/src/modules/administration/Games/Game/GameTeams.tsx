import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColumns,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { IGame } from "../../../../utils/types";
import { useState } from "react";
import { TeamTextField } from "./GameTeams.styles";
import { NO_TEAM } from "../../../common/constants/teams";
import { usePlayers, getTeamQueryPath, useTeams } from "./services/queries";
import { useGameId } from "./utils";
import { hasGameStarted } from "../utils";
import { ErrorAlert, SuccessAlert } from "../../../alert";
import { useTranslation } from "../../../translations/useTranslation";
import { I18nTranslateFunction } from "../../../translations";

export { GameTeams };

const TEAM_COUNT_MIN = 1;

function GameTeams({ game }: { game: IGame }): JSX.Element {
  const gameId = useGameId();
  const { t } = useTranslation();

  const [teamsQuantity, setTeamsQuantity] = useState<number>(TEAM_COUNT_MIN);

  const playersQuery = usePlayers(gameId);
  const teamQueryPath = getTeamQueryPath(gameId);
  const teamQuery = useTeams(teamQueryPath, {
    onSuccess: (data) => {
      const teamCount = data.data.teams.filter(
        (team) => team.name !== NO_TEAM
      ).length;
      setTeamsQuantity(Math.max(teamCount, TEAM_COUNT_MIN));
    },
  });

  const queryClient = useQueryClient();

  const createTeamsMutation = useMutation<
    Response,
    { message: string },
    { quantity: number }
  >(
    ({ quantity }) => {
      return axios.post(`/api/teams`, { gameId, quantity });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
        queryClient.invalidateQueries(teamQueryPath);
      },
    }
  );

  const removeTeamMutation = useMutation<
    Response,
    { message: string },
    { teamId: number }
  >(
    ({ teamId }) => {
      return axios.post("/api/games/remove-team", { teamId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
        queryClient.invalidateQueries(
          `/api/teams?${new URLSearchParams({
            gameId: `${gameId}`,
          })}`
        );
      },
    }
  );

  const orderPlayersMutation = useMutation<Response, { message: string }>(
    () => {
      return axios.put(`/api/games/${gameId}/players/order`, { gameId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}`);
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
        queryClient.invalidateQueries(teamQueryPath);
      },
    }
  );

  const handleChange = (e: any) => {
    setTeamsQuantity(e.target.value);
  };

  if (playersQuery.isLoading || teamQuery.isLoading) {
    return <CircularProgress />;
  }

  const players = playersQuery?.data?.data?.players ?? [];
  const teams = teamQuery?.data?.data?.teams ?? [];

  const rows = teams.map((team) => {
    const playersWithTeams = players.map(({ playedGames, ...player }) => {
      const teamId = playedGames.find(
        ({ gameId: gId }: { gameId: number }) => gId === gameId
      )?.team.id;
      return { playerId: player.id, teamId: teamId };
    });
    return {
      id: team.id,
      name: team.name,
      numberOfPlayers: playersWithTeams.filter(
        ({ teamId }) => teamId === team.id
      ).length,
    };
  });

  return (
    <>
      <Box style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={buildColumns({
            game,
            removeTeam: (teamId: number) =>
              removeTeamMutation.mutate({ teamId }),
            t,
          })}
          disableSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[10]}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      {!hasGameStarted(game.status) && (
        <>
          <Grid
            container
            alignItems="center"
            sx={{ float: "left", pb: 2, pt: 2 }}
          >
            <TeamTextField
              sx={{ textAlign: "center", ml: 2, mr: 2 }}
              id="outlined-number"
              label={t("form.field.team-count.label")}
              type="number"
              value={teamsQuantity}
              onChange={handleChange}
              InputProps={{
                inputProps: {
                  min: TEAM_COUNT_MIN,
                },
              }}
            />
            <Button
              onClick={() =>
                createTeamsMutation.mutate({ quantity: Number(teamsQuantity) })
              }
              variant="contained"
              sx={{ marginRight: "auto", ml: 2, height: "80%" }}
            >
              {t("cta.set-team-count")}
            </Button>
          </Grid>
          <Grid container alignItems="center" sx={{ pb: 2, pt: 2 }}>
            <Button
              onClick={() => orderPlayersMutation.mutate()}
              variant="contained"
              sx={{ marginRight: "auto", marginLeft: "auto", height: "100%" }}
            >
              {t("cta.assign-team-to-players")}
            </Button>
          </Grid>
        </>
      )}

      {createTeamsMutation.isSuccess && (
        <SuccessAlert message={t("message.success.admin.teams-created")} />
      )}
      {removeTeamMutation.isSuccess && (
        <SuccessAlert message={t("message.success.admin.team-removed")} />
      )}
      {orderPlayersMutation.isSuccess && (
        <SuccessAlert
          message={t("message.success.admin.team-assigned-to-players")}
        />
      )}
      {(createTeamsMutation.isError ||
        removeTeamMutation.isError ||
        orderPlayersMutation.isError) && (
        <ErrorAlert message={t("message.error.admin.global.UNEXPECTED")} />
      )}
    </>
  );
}

interface Row {
  id: number;
  name: string;
  numberOfPlayers: number;
}

function buildColumns({
  game,
  removeTeam,
  t,
}: {
  game: IGame;
  removeTeam: (teamId: number) => void;
  t: I18nTranslateFunction;
}): GridColumns<Row> {
  return [
    {
      field: "name",
      headerName: t("table.column.team-name.label"),
      flex: 1,
      minWidth: 150,
    },
    {
      field: "numberOfPlayers",
      headerName: t("table.column.player-count.label"),
      flex: 1,
      minWidth: 250,
    },
    ...buildActionColumns({ game, removeTeam }),
  ];
}

function buildActionColumns({
  game,
  removeTeam,
}: {
  game: IGame;
  removeTeam: (teamId: number) => void;
}): GridColumns<Row> {
  if (hasGameStarted(game.status)) {
    return [];
  }
  return [
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params: GridRowParams<Row>) =>
        params.row.name !== NO_TEAM
          ? [<DeleteActionCellItem params={params} removeTeam={removeTeam} />]
          : [],
    },
  ];
}

function DeleteActionCellItem({
  params,
  removeTeam,
}: {
  params: GridRowParams<Row>;
  removeTeam: (teamId: number) => void;
}) {
  const { t } = useTranslation();

  const teamId = params.row.id;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => setIsDialogOpen(true)}
      />

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("modal.remove-team.title")}
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={() => setIsDialogOpen(false)}>
            {t("cta.no")}
          </Button>
          <Button
            onClick={() => {
              removeTeam(teamId);
              setIsDialogOpen(false);
            }}
          >
            {t("cta.yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
