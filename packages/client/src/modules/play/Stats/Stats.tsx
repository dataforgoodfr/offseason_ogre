import { Box, Grid } from "@mui/material";
import { PlayLayout } from "../PlayLayout";
import { PlayerHeader } from "../PlayerPersona";
import { StatsGraphs } from "./StatsGraphs";

export { Stats };

function Stats() {
  return (
    <PlayLayout title="StatsHeader">
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
            <StatsGraphs />
          </Grid>
        </Grid>
      </Box>
    </PlayLayout>
  );
}
