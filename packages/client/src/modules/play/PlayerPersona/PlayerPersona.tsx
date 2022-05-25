import { Box, Grid } from "@mui/material";
import { PlayLayout } from "..";

import { Persona } from "./Persona";
import { PlayerHeader } from "./PlayerHeader";

export { PlayerPersona };

function PlayerPersona() {
  return (
    <PlayLayout title="Persona">
      <Box>
        <Grid container direction="row">
          <Grid
            item
            xs={12}
            sm={3}
            sx={{
              pl: 1,
              pr: 1,
            }}
          >
            <PlayerHeader />
          </Grid>
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
    </PlayLayout>
  );
}
