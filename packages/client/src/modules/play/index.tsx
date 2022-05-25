import { Link } from "react-router-dom";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorAlert, SuccessAlert } from "../alert";
import { LoggedUser } from "../auth";
import { useAuth } from "../auth/authProvider";

export { MyGames, PlayLayout };

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
        <Card key={game.id} sx={{ mt: 2, pl: 1, pr: 1 }}>
          <CardContent>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={10}>
                <Typography variant="h6">{game.name}</Typography>
                <Typography>
                  {"Date: " + new Date(game.date).toLocaleString()}
                </Typography>
              </Grid>
              {game.status === "ready" && (
                <Grid display="flex" xs={2}>
                  <Button
                    component={Link}
                    color="secondary"
                    variant="contained"
                    to={`/play/my-games/${game.id}/persona`}
                    sx={{ ml: "auto" }}
                  >
                    <VideogameAssetRoundedIcon sx={{ mr: 2 }} /> Jouer
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
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

function PlayLayout({
  title,
  children,
}: {
  title: string;
  children: JSX.Element;
}) {
  const { user } = useAuth();

  return (
    <Box display="flex">
      <AppBar color="primary" position="fixed">
        <Toolbar>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {user?.firstName || user?.lastName
              ? `${user.firstName} ${user.lastName} | `
              : ""}{" "}
            {title}
          </Typography>
          <LoggedUser />
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          bgcolor: "#577590",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: "auto" }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
