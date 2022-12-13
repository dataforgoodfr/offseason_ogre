import { Box, Grid } from "@mui/material";

import { Persona } from "./Persona";
import { PlayerHeaderGrid } from "./PlayerHeaderGrid";

export { PlayerPersona, PlayerHeaderGrid };

function PlayerPersona() {
  return (
    <Box>
      <Grid container direction="row" rowSpacing={4}>
        <PlayerHeaderGrid />
        <Grid
          item
          xs={12}
          sm={9}
          sx={{
            pl: 1,
            pr: 1,
          }}
        >
          <Persona />
        </Grid>
      </Grid>
    </Box>
  );
}
