import { Link } from "react-router-dom";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorAlert, SuccessAlert } from "../../alert";
import { PlayBox } from "../Components";
import {
  CustomContainer,
  CustomDivider,
  CustomPaper,
  GameItemHost,
} from "./styles";

export { MyGames };

interface Registration {
  gameId: number;
}

function MyGames() {
  return (
    <CustomContainer maxWidth="lg">
      <Typography variant="h3" color="secondary">
        Mes ateliers
      </Typography>
      <CustomDivider>
        <JoinGame />
      </CustomDivider>
      <MyGamesList />
    </CustomContainer>
  );
}

function GameItem({ game }: any) {
  return (
    <PlayBox sx={{ mt: 2 }}>
      <GameItemHost>
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
      </GameItemHost>
    </PlayBox>
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
        <GameItem key={game.id} game={game} />
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
    <CustomPaper>
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
    </CustomPaper>
  );
}
