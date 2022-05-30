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
import { IGame } from "../../../../utils/types";
import { SuccessAlert } from "../../../alert";
import { Navigate } from "react-router-dom";

const TeamHasTooManyPLayers = (playersQuery: any) => {
  const players = playersQuery?.data?.data?.players ?? [];
  const teams = players.map((player: any) => (
    player.playedGames[0].team.name
  ));
  const teamOccurences = teams.reduce((obj: any, teamName: string) => {
    obj[teamName] = ++obj[teamName] || 1;
    return obj;
  }, {});
  for (let teamName in teamOccurences) {
    if (teamOccurences[teamName] > 5) {
      return true;
    }
  }
  return false;
}

export default function Launch({ game }: { game: IGame }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const playersQuery = useQuery(`/api/games/${game.id}/players`, () => {
    return axios.get<undefined, { data: { players: any[] } }>(
      `/api/games/${game.id}/players`
    );
  });
  const dialogContent = {
    message: "Êtes-vous sûr.e de vouloir lancer l'atelier ?",
    warningMessage: "Une ou plusieurs équipe(s) dépasse(nt) le nombre de joueurs recommandé (5 joueurs)"
  }

  const mutation = useMutation<Response, { message: string }, any>(
    (status: boolean) => {
      const path = `/api/games/${game.id}`;
      return axios.put(path, { status: "ready" });
    },
    {
      onSuccess: () => queryClient.invalidateQueries([`/api/games/${game.id}`]),
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
      {mutation.isSuccess && <SuccessAlert /> && <Navigate to="/administration/games" replace={true} />}
      {/* {game.status === "ready" && <Navigate to="/administration/games" replace={true} />} */}
      <Button
        onClick={() => {
          game.status === "draft" ? handleClickOpen() : <Navigate to="/administration/games" replace={true} />
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
            sx={{ color: 'red', mb: 2 }}
          >
            {TeamHasTooManyPLayers(playersQuery) && dialogContent.warningMessage}
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