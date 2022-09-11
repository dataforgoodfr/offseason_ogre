import { Box, Grid } from "@mui/material";
import { Actions } from "./Actions";
import { ValidateActions } from "./Validation";
import { PlayerHeader } from "../PlayerPersona/PlayerHeader";
import { PlayerHeaderGrid } from "./PlayerHeaderGrid";

export { PlayerActions, PlayerHeader };

function PlayerActions() {
  return (
    <Box>
      <Grid container direction="row" rowSpacing={4}>
        <PlayerHeaderGrid additionalActions={<ValidateActions />} />
        <Grid
          item
          xs={12}
          sm={9}
          sx={{
            pl: 1,
            pr: 1,
          }}
        >
          <Actions />
        </Grid>
      </Grid>
    </Box>
  );
}
