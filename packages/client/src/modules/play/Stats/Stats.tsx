import { Box, Grid } from "@mui/material";
import { PlayerHeaderGrid } from "../PlayerPersona";
import { StatsGraphs } from "./StatsGraphs";

export { Stats };

function Stats() {
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
          <StatsGraphs />
        </Grid>
      </Grid>
    </Box>
  );
}
