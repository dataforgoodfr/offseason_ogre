import { Button } from "@mui/material";
import {
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export { HelpDialog };

function HelpDialog({
  open,
  handleClose,
  message,
}: {
  open: boolean;
  handleClose: () => void;
  message: string;
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="help for action choices"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <Grid container direction="row">
          <Grid item xs={2}>
            <img
              style={{ border: "2px solid white", borderRadius: "5px" }}
              src="/sage.png"
              alt="sage"
            />
          </Grid>
          <Grid item xs={8}>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          sx={{ border: 1, borderColor: "secondary" }}
          onClick={handleClose}
        >
          Merci pour l'aide
        </Button>
      </DialogActions>
    </Dialog>
  );
}
