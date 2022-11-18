import { Typography, FormControlLabel, Checkbox, Button } from "@mui/material";
import { Dialog } from "../../../common/components/Dialog";
import { useNavigate } from "react-router-dom";

const ValidateDialogContent = ({
  rgpdCheckbox,
  setRgpdCheckbox,
}: {
  rgpdCheckbox: boolean;
  setRgpdCheckbox: (value: boolean) => void;
}) => {
  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Êtes-vous sûr de vouloir valider votre formulaire?
      </Typography>
      <Typography sx={{ textAlign: "justify", fontStyle: "italic" }}>
        Afin de pouvoir mener l’atelier dans les meilleures conditions,
        l’animateur OGRE aura accès à vos données de consommation. Il ne les
        utilisera pas en dehors de l’atelier et n’en partagera pas le contenu,
        la seule finalité est de personnaliser votre expérience durant
        l’atelier. Vous pouvez à tout moment revenir en arrière et choisir les
        données de consommation des personas OGRE si vous préférez ne pas
        communiquer vos données.
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={rgpdCheckbox}
            onChange={(event) => setRgpdCheckbox(event?.target.checked)}
            color="primary"
          />
        }
        label="J’accepte de partager mes données avec l’animateur"
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
            Non
          </Button>
          <Button
            color="primary"
            variant="contained"
            sx={{ border: 1, borderColor: "secondary" }}
            onClick={() => navigate(`/play/games/${gameId}/personalize/choice`)}
          >
            Oui
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
            Annuler
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
            Valider
          </Button>
        </>
      }
    />
  );
};
