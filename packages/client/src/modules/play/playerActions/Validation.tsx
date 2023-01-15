import { Box, Button } from "@mui/material";
import { useState } from "react";
import { Dialog } from "../../common/components/Dialog";
import { usePlay } from "../context/playContext";

export { ValidateActions };

function ValidateActions() {
  const { player, updatePlayer } = usePlay();

  const [open, setOpen] = useState<boolean>(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFinishStep = () => {
    updatePlayer({ hasFinishedStep: true });
    handleClose();
  };

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
        disabled={player.hasFinishedStep}
        onClick={handleClickOpen}
      >
        Terminer le tour
      </Button>

      <Dialog
        open={open}
        handleClose={handleClose}
        content="Les choix ne seront plus modifiables, souhaites-tu valider tes choix ?"
        actions={
          <>
            <Button onClick={handleClose}>Non</Button>
            <Button onClick={handleFinishStep} autoFocus>
              Oui
            </Button>
          </>
        }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      />
    </Box>
  );
}
