import { Button } from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { IGame, ITeamWithPlayers } from "../../../../utils/types";
import { SuccessAlert } from "../../../alert";
import { useNavigate } from "react-router-dom";

type IGameWithTeams = IGame & { teams: ITeamWithPlayers[] };

const hasTeamWithTooManyPlayers = (teams: ITeamWithPlayers[]) => {
  const MAX_TEAM_SIZE = 5;
  return teams.some((team: ITeamWithPlayers) => team.players.length > MAX_TEAM_SIZE);
};

export default function Launch({ game }: { game: IGameWithTeams }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dialogContent = {
    message: "Êtes-vous sûr.e de vouloir lancer l'atelier ?",
    warningMessage:
      "Une ou plusieurs équipe(s) dépasse(nt) le nombre de joueurs recommandé (5 joueurs)",
  };

  const navigate = useNavigate();
  const mutation = useMutation<Response, { message: string }, any>(
    (status: boolean) => {
      const path = `/api/games/${game.id}`;
      return axios.put(path, { status: "ready" });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`/api/games/${game.id}`]);
        navigate(`/play/games/${game.id}/console`);
      },
    }
  );

  const launchGame = () => {
    if (game.status === "draft") {
      mutation.mutate({ status: true });
    }
    setOpen(false);
  };

  return (
    <div>
      {mutation.isSuccess && <SuccessAlert />}
      <Button
        onClick={() => {
          game.status === "draft"
            ? handleClickOpen()
            : navigate(`/play/games/${game.id}/console`);
        }}
        variant="contained"
        color="secondary"
      >
        <RocketLaunchIcon sx={{ height: "1rem" }} />
        {game.status === "draft" ? "Animer" : "Rejoindre"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Lancer la partie ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-warning"
            sx={{ color: "red", mb: 2 }}
          >
            {hasTeamWithTooManyPlayers(game.teams) &&
              dialogContent.warningMessage}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            {dialogContent.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={launchGame} autoFocus>
            Continuer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
