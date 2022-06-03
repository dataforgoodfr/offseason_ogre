import { Link } from "react-router-dom";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorAlert, SuccessAlert } from "../alert";
import { GameConsole } from "./GameConsole";
import { PlayerPersona } from "./PlayerPersona";
import { PlayLayout } from "./PlayLayout";
import { PlayBox } from "./Components";

export { GameConsole, MyGames, PlayerPersona };

interface Registration {
  gameId: number;
}

function MyGames() {
  return (
    <PlayLayout title="Ateliers">
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: 4 }}>
        <Typography variant="h3" color="secondary">
          Mes ateliers
        </Typography>
        <Divider
          sx={{
            "&::before, &::after": {
              borderColor: "secondary.light",
            },
            mt: 4,
          }}
        >
          <JoinGame />
        </Divider>
        <MyGamesList />
      </Container>
    </PlayLayout>
  );
}

function MyGamesList() {
  const query = useQuery("/api/games/played-games", () => {
    return axios.get<undefined, { data: { games: any[] } }>(
      "/api/games/played-games"
    );
  });

  if (query.isLoading) {
    return <CircularProgress />;
  }

  const games = query?.data?.data?.games ?? [];
  return (
    <Box sx={{ mt: 4 }}>
      {games.map((game) => (
        <PlayBox key={game.id} sx={{ mt: 2 }}>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={10}>
              <Typography variant="h6">{game.name}</Typography>
              <Typography>
                {"Date: " + new Date(game.date).toLocaleString()}
              </Typography>
            </Grid>
            {game.status === "ready" && (
              <Grid item display="flex" xs={2}>
                <Button
                  component={Link}
                  color="secondary"
                  variant="contained"
                  to={`/play/games/${game.id}/persona`}
                  sx={{ ml: "auto" }}
                >
                  <VideogameAssetRoundedIcon sx={{ mr: 2 }} /> Jouer
                </Button>
              </Grid>
            )}
          </Grid>
        </PlayBox>
      ))}
    </Box>
  );
}

function JoinGame() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      gameId: 0,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation<Response, { message: string }, Registration>(
    ({ gameId }) => {
      return axios.post("/api/games/register", { gameId });
    },
    {
      onSuccess: (data, { gameId }) => {
        queryClient.invalidateQueries("/api/games/played-games");
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
      },
    }
  );

  const onValid = (registration: Registration) => mutation.mutate(registration);
  return (
    <Paper sx={{ width: "443px", p: 2 }}>
      <form onSubmit={handleSubmit(onValid)}>
        <Grid container>
          <Controller
            control={control}
            name="gameId"
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                label="Game Id"
                type="number"
                required
              />
            )}
          />
          <Button
            type="submit"
            sx={{ width: "200px", ml: 2 }}
            variant="contained"
          >
            Rejoindre le jeu
          </Button>
        </Grid>
      </form>
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      {mutation.isSuccess && <SuccessAlert />}
    </Paper>
  );
}
