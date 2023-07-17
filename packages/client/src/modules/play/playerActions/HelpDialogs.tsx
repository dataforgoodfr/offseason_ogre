import { Button } from "../../common/components/Button";
import { Dialog } from "../../common/components/Dialog";
import { Typography } from "../../common/components/Typography";
import { useTranslation } from "../../translations/useTranslation";

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
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      aria-labelledby="help for action choices"
      aria-describedby="alert-dialog-description"
      actions={
        <Button onClick={handleClose}>{t("cta.thanks-for-help")}</Button>
      }
    >
      <Typography>{message}</Typography>
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
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      handleClose={handleClose}
      aria-labelledby="pdf info help for action choices"
      aria-describedby="alert-dialog-description"
      actions={
        <>
          <Button type="secondary" onClick={handleClose}>
            {t("cta.thanks-for-help")}
          </Button>
          <Button iconName="open-in-new-tab" to={helpCardLink}>
            {t("cta.open-info-card")}
          </Button>
        </>
      }
    >
      <Typography>{message}</Typography>
    </Dialog>
  );
}
