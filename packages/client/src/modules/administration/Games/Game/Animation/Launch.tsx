import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { IGame, ITeamWithPlayers } from "../../../../../utils/types";
import { SuccessAlert } from "../../../../alert";
import { useNavigate } from "react-router-dom";
import { hasGameStarted } from "../../utils";
import { Button } from "../../../../common/components/Button";
import { Dialog } from "../../../../common/components/Dialog";
import { Typography } from "../../../../common/components/Typography";
import { NO_TEAM } from "../../../../common/constants/teams";
import { usePlayers } from "../services/queries";
import { t } from "../../../../translations";
import { http } from "../../../../../utils/request";

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
    (team: ITeamWithPlayers) => team.name === NO_TEAM
  )?.players;
  return noTeamPlayers && noTeamPlayers?.length > 0;
};

const getPlayersWithUnvalidatedFormCount = (players: any[], gameId: number) => {
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
    warningMessage: `Une ou plusieurs équipe(s) dépasse(nt) le nombre de joueurs recommandé (${MAX_TEAM_SIZE} joueurs)`,
  };

  const playersQuery = usePlayers(game.id);
  const players =
    playersQuery?.data?.data?.players?.map((p: any) => ({
      id: p.id,
      playedGames: p.playedGames,
    })) ?? [];
  const playersWithUnvalidatedForms = getPlayersWithUnvalidatedFormCount(
    players,
    game.id
  );

  const playersWithoutTeams = hasPlayersWithoutTeam(game.teams);

  const navigate = useNavigate();
  const launchGameMutation = useMutation<Response, { message: string }, any>(
    () => {
      const path = `/api/games/${game.id}`;
      return http.put(path, { status: "playing" });
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
      launchGameMutation.mutate({ status: true });
    }
    setSuccessDialogOpen(false);
  };

  const handleLaunchGame = () => {
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
      {launchGameMutation.isSuccess && <SuccessAlert />}
      <Button
        loading={playersQuery.isLoading || launchGameMutation.isLoading}
        onClick={handleLaunchGame}
      >
        <RocketLaunchIcon sx={{ height: "1rem" }} />
        {!hasGameStarted(game.status) ? "Animer" : "Rejoindre"}
      </Button>
      <Dialog
        open={successDialogOpen}
        handleClose={() => setSuccessDialogOpen(false)}
        actions={
          <>
            <Button
              type="secondary"
              onClick={() => setSuccessDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={launchGame}>Continuer</Button>
          </>
        }
      >
        <Typography sx={{ color: "red", mb: 2 }}>
          {hasTeamWithTooManyPlayers(game.teams, MAX_TEAM_SIZE) &&
            dialogContent.warningMessage}
        </Typography>
        <Typography>{t("launch.success.confirmation")}</Typography>
      </Dialog>
      <Dialog
        open={errorDialogOpen}
        handleClose={() => setErrorDialogOpen(false)}
        actions={
          <>
            <Button type="secondary" onClick={() => setErrorDialogOpen(false)}>
              Fermer
            </Button>
          </>
        }
      >
        {playersWithoutTeams && (
          <Typography sx={{ color: "red", mb: 2 }}>
            {t("launch.error.playersWithoutTeams")}
          </Typography>
        )}
        {playersWithUnvalidatedForms > 0 && (
          <Typography sx={{ color: "red", mb: 2 }}>
            {playersWithUnvalidatedForms > 1
              ? t("launch.error.playerWithUnvalidatedForm_p")
              : t("launch.error.playerWithUnvalidatedForm")}
          </Typography>
        )}
      </Dialog>
    </div>
  );
}
