import { Button } from "@mui/material";

import { Dialog } from "../../common/components/Dialog";
import { Icon } from "../../common/components/Icon";

export { StepHelpDialog, ActionHelpDialog };

function StepHelpDialog({
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
      handleClose={handleClose}
      aria-labelledby="help for action choices"
      aria-describedby="alert-dialog-description"
      actions={
        <Button
          color="primary"
          variant="contained"
          type="submit"
          sx={{ border: 1, borderColor: "secondary" }}
          onClick={handleClose}
        >
          Merci pour l'aide
        </Button>
      }
    >
      {message}
    </Dialog>
  );
}

function ActionHelpDialog({
  open,
  handleClose,
  message,
  helpCardLink,
}: {
  open: boolean;
  handleClose: () => void;
  message: string;
  helpCardLink: string;
}) {
  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      aria-labelledby="pdf info help for action choices"
      aria-describedby="alert-dialog-description"
      actions={
        <>
          <Button
            color="secondary"
            variant="contained"
            sx={{ border: 1, borderColor: "secondary" }}
            component="a"
            target="_blank"
            href={helpCardLink}
            startIcon={<Icon name="open-in-new-tab" />}
          >
            Ouvrir la carte
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            sx={{ border: 1, borderColor: "secondary", mt: 1 }}
            onClick={handleClose}
          >
            Merci pour l'aide
          </Button>
        </>
      }
    >
      {message}
    </Dialog>
  );
}
