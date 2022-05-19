import { Box, CircularProgress, Grid } from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { PlayLayout } from ".";

import { Persona } from "./Persona";
import { PlayerHeader } from "./PlayerHeader";

export { PlayerPersona };

interface Game {
  id: number;
  name: string;
  date: Date;
  teacherId: string;
  description?: string;
}

function PlayerPersona() {
  const params = useParams();
  const { data, isLoading } = useQuery(
    `/play/my-games/${params.id}/persona`,
    () => {
      return axios.get<any, { data: { document: null | Game } }>(
        `/api/games/${params.id}`
      );
    }
  );

  const game = data?.data?.document || null;

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <PlayLayout title="Persona">
      <Box sx={{ height: "100vh", bgcolor: "#577590" }}>
        <Grid container direction="row" sx={{ pt: 3 }}>
          <Grid
            item
            xs={12}
            sm={2}
            sx={{
              pl: 1,
              pr: 1,
            }}
          >
            <PlayerHeader game={{ gameId: game?.id }} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={10}
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
