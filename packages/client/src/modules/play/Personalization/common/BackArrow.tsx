import { Grid, Button } from "@mui/material";
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
