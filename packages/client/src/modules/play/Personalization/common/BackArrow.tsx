import { Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Icon } from "../../../common/components/Icon";

export const BackArrow = () => {
  return (
    <Grid item display="flex" xs={2}>
      <Button
        component={Link}
        color="secondary"
        variant="contained"
        to={`/play/games`}
        sx={{ ml: "auto", margin: "2% 0 5% 0", padding: "1% 2% 1% 2%" }}
      >
        <Icon name="arrow-back" sx={{ mr: 1 }} />
        Retour
      </Button>
    </Grid>
  );
};
