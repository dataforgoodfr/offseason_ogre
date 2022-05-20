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
import { useMutation, useQueryClient } from "react-query";

export default function AlertDialog(props: any) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const mutation = useMutation<Response, { message: string }, any>(
    (status: boolean) => {
      const path = `/api/games/${props.gameId}/launch`;
      return axios.put(path, status);
    },
    {
      onSuccess: (data, game) =>
        queryClient.invalidateQueries([`/api/games/${props.gameId}`]),
    }
  );

  const launchGame = () => {
    if (props.gameStatus === false) {
      mutation.mutate({ status: true });
      setOpen(false);
    }
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>
        <RocketLaunchIcon sx={{ height: "1rem" }} />
        Animer
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
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr.e de vouloir lancer l’atelier ?
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
