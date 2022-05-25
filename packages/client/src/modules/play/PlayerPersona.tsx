import { Box, CircularProgress, Grid } from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { PlayLayout } from ".";
import { Game } from "../games/types";

import { Persona } from "./Persona";
import { PlayerHeader } from "./PlayerHeader";

export { PlayerPersona };

function PlayerPersona() {
  const params = useParams();
  const { data, isLoading } = useQuery(`/play/games/${params.id}`, () => {
    return axios.get<any, { data: { document: null | Game } }>(
      `/api/games/${params.id}`
    );
  });

  const game = data?.data?.document;

  if (!game) {
    return <>No Game found!</>;
  }

  if (isLoading) {
    return <CircularProgress />;
  }

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
            <PlayerHeader game={game} />
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
