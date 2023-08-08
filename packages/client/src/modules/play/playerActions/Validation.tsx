import { Box } from "@mui/material";
import { Dialog } from "../../common/components/Dialog";
import { useTranslation } from "../../translations/useTranslation";
import { usePlay } from "../context/playContext";
import { useCurrentPlayer } from "../context/hooks/player";
import { Button } from "../../common/components/Button";
import { useDialog } from "../../common/hooks/useDialog";

export { ValidateActions };

function ValidateActions() {
  const { t } = useTranslation();
  const { updatePlayer } = usePlay();
  const { player } = useCurrentPlayer();
  const { isOpen, closeDialog, openDialog } = useDialog();

  const handleFinishStep = () => {
    updatePlayer({ hasFinishedStep: true });
    closeDialog();
  };

  return (
    <Box mt={2}>
      <Button
        width={250}
        disabled={player.hasFinishedStep}
        onClick={openDialog}
      >
        {t(`cta.end-turn`)}
      </Button>

      <Dialog
        open={isOpen}
        handleClose={closeDialog}
        content={t(`modal.validate-consumption-choices.title`)}
        actions={
          <>
            <Button type="secondary" onClick={closeDialog}>
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
