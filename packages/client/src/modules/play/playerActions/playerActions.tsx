import { Box, Grid } from "@mui/material";
import { PlayLayout } from "../PlayLayout";

import { Actions } from "./Actions";
import { PlayerHeader } from "../PlayerPersona/PlayerHeader";

export { PlayerActions, PlayerHeader };

function PlayerActions() {
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
            <Actions />
          </Grid>
        </Grid>
      </Box>
    </PlayLayout>
  );
}
