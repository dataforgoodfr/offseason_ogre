import { Box, Button } from "@mui/material";
import { useState } from "react";
import { Dialog } from "../../common/components/Dialog";
import { useTranslation } from "../../translations/useTranslation";
import { usePlay } from "../context/playContext";

export { ValidateActions };

function ValidateActions() {
  const { t } = useTranslation();
  const { player, updatePlayer } = usePlay();

  const [open, setOpen] = useState<boolean>(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFinishStep = () => {
    updatePlayer({ hasFinishedStep: true });
    handleClose();
  };

  return (
    <Box mt={2}>
      <Button
        variant="contained"
        color="actionValidation"
        sx={{
          width: "200px",
        }}
        disabled={player.hasFinishedStep}
        onClick={handleClickOpen}
      >
        {t(`cta.end-turn`)}
      </Button>

      <Dialog
        open={open}
        handleClose={handleClose}
        content={t(`modal.validate-consumption-choices.title`)}
        actions={
          <>
            <Button onClick={handleClose}>{t(`cta.no`)}</Button>
            <Button onClick={handleFinishStep} autoFocus>
              {t(`cta.yes`)}
            </Button>
          </>
        }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      />
    </Box>
  );
}
