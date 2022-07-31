import { Button } from "@mui/material";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export { DialogHelp };

function DialogHelp(
  { open }: { open: boolean },
  { handleClose }: { handleClose: () => void }
) {
  const message =
    "Tu peux utiliser tes points d’action pour réduire ta consommation. Tu en as un nombre limité, alors utilise-les à bon escient. Tu ne peux les utiliser que pour ce tour. Fais attention car certaines actions coûtent de l’argent en plus des points d’action.";
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="help for action choices"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Merci pour l'aide</Button>
      </DialogActions>
    </Dialog>
  );
}
