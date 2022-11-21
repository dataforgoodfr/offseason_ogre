import { Button } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { IGame, ITeamWithPlayers } from "../../../../../utils/types";
import { SuccessAlert } from "../../../../alert";
import { useNavigate } from "react-router-dom";
import { hasGameStarted } from "../../utils";
import { Dialog } from "../../../../common/components/Dialog";
import { Typography } from "../../../../common/components/Typography";
import { NO_TEAM } from "../../../../common/constants/teams";
import { usePlayers } from "../services/queries";

type IGameWithTeams = IGame & { teams: ITeamWithPlayers[] };

const hasTeamWithTooManyPlayers = (
  teams: ITeamWithPlayers[],
  MAX_TEAM_SIZE: number
) => {
  return teams.some(
    (team: ITeamWithPlayers) => team.players.length > MAX_TEAM_SIZE
  );
};

const hasPlayersWithoutTeam = (teams: ITeamWithPlayers[]) => {
  const noTeamPlayers = teams.find(
    (team: ITeamWithPlayers) => (team.name = NO_TEAM)
  )?.players;
  return noTeamPlayers && noTeamPlayers?.length > 0;
};

const hasPlayersWithUnvalidatedForm = (players: any[], gameId: number) => {
  return players
    .map(({ playedGames }) => {
      const currentGame = playedGames.find(
        ({ gameId: gId }: { gameId: number }) => gId === gameId
      );
      return currentGame?.profile?.status === "pendingValidation";
    })
    .filter(Boolean).length;
};

export default function Launch({ game }: { game: IGameWithTeams }) {
  const queryClient = useQueryClient();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const MAX_TEAM_SIZE = 5;
  const dialogContent = {
    message: "Êtes-vous sûr.e de vouloir lancer l'atelier ?",
    warningMessage: `Une ou plusieurs équipe(s) dépasse(nt) le nombre de joueurs recommandé (${MAX_TEAM_SIZE} joueurs)`,
  };

  const playersQuery = usePlayers(game.id);
  const players =
    playersQuery?.data?.data?.players?.map((p: any) => ({
      id: p.id,
      playedGames: p.playedGames,
    })) ?? [];
  const playersWithUnvalidatedForms = hasPlayersWithUnvalidatedForm(
    players,
    game.id
  );

  const playersWithoutTeams = hasPlayersWithoutTeam(game.teams);

  const errorDialog = {
    playersWithoutTeams:
      "Certains joueurs ne sont pas répartis dans une équipe, répartissez tous les joueurs avant de démarrer la partie.",
    unvalidatedForms: `Attention, les données de ${playersWithUnvalidatedForms} joueur${
      playersWithUnvalidatedForms > 1 ? "s" : ""
    } ne sont pas validées. Veuillez vérifier ces données pour pouvoir lancer l’atelier.`,
  };

  const navigate = useNavigate();
  const mutation = useMutation<Response, { message: string }, any>(
    () => {
      const path = `/api/games/${game.id}`;
      return axios.put(path, { status: "playing" });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`/api/games/${game.id}`]);
        navigate(`/play/games/${game.id}/console`);
      },
    }
  );

  const launchGame = () => {
    if (!hasGameStarted(game.status)) {
      mutation.mutate({ status: true });
    }
    setSuccessDialogOpen(false);
  };

  const launchGameButton = () => {
    if (!hasGameStarted(game.status)) {
      if (playersWithoutTeams || playersWithUnvalidatedForms > 0) {
        return setErrorDialogOpen(true);
      }
      return setSuccessDialogOpen(true);
    }
    return navigate(`/play/games/${game.id}/console`);
  };

  return (
    <div>
      {mutation.isSuccess && <SuccessAlert />}
      <Button
        disabled={playersQuery.isLoading}
        onClick={launchGameButton}
        variant="contained"
        color="secondary"
      >
        <RocketLaunchIcon sx={{ height: "1rem" }} />
        {!hasGameStarted(game.status) ? "Animer" : "Rejoindre"}
      </Button>
      <Dialog
        open={successDialogOpen}
        handleClose={() => setSuccessDialogOpen(false)}
        actions={
          <>
            <Button onClick={() => setSuccessDialogOpen(false)}>Annuler</Button>
            <Button onClick={launchGame} autoFocus>
              Continuer
            </Button>
          </>
        }
      >
        <Typography sx={{ color: "red", mb: 2 }}>
          {hasTeamWithTooManyPlayers(game.teams, MAX_TEAM_SIZE) &&
            dialogContent.warningMessage}
        </Typography>
        <Typography>{dialogContent.message}</Typography>
      </Dialog>
      <Dialog
        open={errorDialogOpen}
        handleClose={() => setErrorDialogOpen(false)}
        actions={
          <>
            <Button onClick={() => setErrorDialogOpen(false)}> Fermer</Button>
          </>
        }
      >
        {playersWithoutTeams && (
          <Typography sx={{ color: "red", mb: 2 }}>
            {errorDialog.playersWithoutTeams}
          </Typography>
        )}
        {playersWithUnvalidatedForms > 0 && (
          <Typography sx={{ color: "red", mb: 2 }}>
            {errorDialog.unvalidatedForms}
          </Typography>
        )}
      </Dialog>
    </div>
  );
}
