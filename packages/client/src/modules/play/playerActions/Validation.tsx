import { Box, Button } from "@mui/material";
import { Dialog, DialogTitle, DialogActions } from "@mui/material";
import { useState } from "react";

export { ValidateActions };

function ValidateActions() {
  const [open, setOpen] = useState<boolean>(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button
        variant="contained"
        color="actionValidation"
        sx={{
          mt: 2,
          width: "200px",
          height: "3rem",
        }}
        onClick={handleClickOpen}
      >
        Terminer le tour
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Valider les actions définitivement ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleClose} autoFocus>
            Continuer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
