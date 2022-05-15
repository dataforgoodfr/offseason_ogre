import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Box,
  Container,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { ErrorAlert, SuccessAlert } from "../alert";
import { LoggedUser } from "../auth";

export { MyGames };

interface Registration {
  gameId: string;
}

function MyGames() {
  return (
    <PlayLayout>
      <>
        <Typography variant="h3">Mes ateliers</Typography>
        <JoinGame />
      </>
    </PlayLayout>
  );
}

function JoinGame() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      gameId: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation<Response, { message: string }, Registration>(
    ({ gameId }) => {
      return axios.post("/api/games/register", { gameId });
    },
    {
      onSuccess: () => queryClient.invalidateQueries("games"),
    }
  );

  const onValid = (registration: Registration) => mutation.mutate(registration);
  return (
    <Box sx={{ mt: 4 }}>
      <form onSubmit={handleSubmit(onValid)}>
        <Grid container>
          <Controller
            control={control}
            name="gameId"
            render={({ field }) => (
              <TextField {...field} label="Game Id" type="number" required />
            )}
          />
          <LoadingButton
            loading={mutation.isLoading}
            type="submit"
            sx={{ width: "200px", ml: 2 }}
            variant="contained"
          >
            Rejoindre le jeu
          </LoadingButton>
        </Grid>
      </form>
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      {mutation.isSuccess && <SuccessAlert />}
    </Box>
  );
}

function PlayLayout({ children }: { children: JSX.Element }) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar color="primary" position="fixed">
        <Toolbar>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Play
          </Typography>
          <LoggedUser />
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
