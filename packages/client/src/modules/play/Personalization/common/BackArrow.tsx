import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Icon } from "../../../common/components/Icon";

export const BackArrow = ({ path }: { path: string }) => {
  return (
    <Grid item display="flex">
      <Button
        component={Link}
        color="secondary"
        variant="contained"
        to={path}
        sx={{
          ml: "auto",
          margin: "15px 0 35px 0",
          padding: "10px 20px 10px 20px",
        }}
      >
        <Icon name="arrow-back" sx={{ mr: 1 }} />
        Retour
      </Button>
    </Grid>
  );
};

export const BackArrowWithValidation = ({
  handleClickOpen,
}: {
  handleClickOpen: () => void;
}) => {
  return (
    <Grid item display="flex">
      <Button
        color="secondary"
        variant="contained"
        onClick={() => handleClickOpen()}
        sx={{
          ml: "auto",
          margin: "15px 0 35px 0",
          padding: "10px 20px 10px 20px",
        }}
      >
        <Icon name="arrow-back" sx={{ mr: 1 }} />
        Retour
      </Button>
    </Grid>
  );
};

export const ValidationDialog = ({
  open,
  handleClose,
  title,
  warningMessage,
  navigate,
  path,
}: {
  open: boolean;
  handleClose: () => void;
  title: string;
  warningMessage: string;
  navigate: any;
  path: string;
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-warning"
          sx={{ color: "red", mb: 2 }}
        >
          {warningMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Non</Button>
        <Button onClick={() => navigate(path)} autoFocus>
          Oui
        </Button>
      </DialogActions>
    </Dialog>
  );
};
