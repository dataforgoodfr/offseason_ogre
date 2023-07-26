import { Box } from "@mui/material";
import { useState } from "react";
import { Dialog } from "../../common/components/Dialog";
import { useTranslation } from "../../translations/useTranslation";
import { usePlay } from "../context/playContext";
import { useCurrentPlayer } from "../context/hooks/player";
import { Button } from "../../common/components/Button";

export { ValidateActions };

function ValidateActions() {
  const { t } = useTranslation();
  const { updatePlayer } = usePlay();
  const { player } = useCurrentPlayer();

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
        width={250}
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
            <Button type="secondary" onClick={handleClose}>
              {t(`cta.no`)}
            </Button>
            <Button onClick={handleFinishStep}>{t(`cta.yes`)}</Button>
          </>
        }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      />
    </Box>
  );
}
