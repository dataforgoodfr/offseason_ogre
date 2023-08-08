import { Typography, FormControlLabel, Checkbox, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Dialog } from "../../../common/components/Dialog";
import { useTranslation } from "../../../translations";

const ValidateDialogContent = ({
  rgpdCheckbox,
  setRgpdCheckbox,
}: {
  rgpdCheckbox: boolean;
  setRgpdCheckbox: (value: boolean) => void;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(
          "page.player.personalization-form.validation-confirmation-dialog.title"
        )}
      </Typography>
      <Typography sx={{ textAlign: "justify", fontStyle: "italic" }}>
        {t(
          "page.player.personalization-form.validation-confirmation-dialog.description"
        )}
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={rgpdCheckbox}
            onChange={(event) => setRgpdCheckbox(event?.target.checked)}
            color="primary"
          />
        }
        label={t("cta.share-data-with-teacher")}
      />
    </>
  );
};

export const BackArrowDialog = ({
  backArrowDialogOpen,
  setBackArrowDialogOpen,
  backArrowDialogContent,
  gameId,
}: {
  backArrowDialogOpen: boolean;
  setBackArrowDialogOpen: (value: boolean) => void;
  backArrowDialogContent: { warningMessage: string };
  gameId: number;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Dialog
      open={backArrowDialogOpen}
      handleClose={() => setBackArrowDialogOpen(false)}
      content={backArrowDialogContent.warningMessage}
      actions={
        <>
          <Button
            color="secondary"
            variant="contained"
            type="submit"
            sx={{ border: 1, borderColor: "secondary", mt: 1 }}
            onClick={() => setBackArrowDialogOpen(false)}
          >
            {t("cta.no")}
          </Button>
          <Button
            color="primary"
            variant="contained"
            sx={{ border: 1, borderColor: "secondary" }}
            onClick={() => navigate(`/play/games/${gameId}/personalize/choice`)}
          >
            {t("cta.yes")}
          </Button>
        </>
      }
    />
  );
};

export const ValidationDialog = ({
  validateDialogOpen,
  setValidateDialogOpen,
  rgpdCheckbox,
  setRgpdCheckbox,
  onSubmit,
}: {
  validateDialogOpen: boolean;
  setValidateDialogOpen: (value: boolean) => void;
  rgpdCheckbox: boolean;
  setRgpdCheckbox: (value: boolean) => void;
  onSubmit: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={validateDialogOpen}
      handleClose={() => setValidateDialogOpen(false)}
      content={
        <ValidateDialogContent
          rgpdCheckbox={rgpdCheckbox}
          setRgpdCheckbox={setRgpdCheckbox}
        />
      }
      actions={
        <>
          <Button
            color="secondary"
            variant="contained"
            sx={{ border: 1, borderColor: "secondary", mt: 1 }}
            onClick={() => setValidateDialogOpen(false)}
          >
            {t("cta.cancel")}
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={!rgpdCheckbox}
            sx={{ border: 1, borderColor: "secondary" }}
            type="submit"
            onClick={() => {
              onSubmit();
              setValidateDialogOpen(false);
            }}
          >
            {t("cta.validate")}
          </Button>
        </>
      }
    />
  );
};
