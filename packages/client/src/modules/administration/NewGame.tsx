import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Layout } from "./Layout";

export { NewGame };

interface INewGame {
  name: string;
}

function NewGame(): JSX.Element {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation<Response, { message: string }, INewGame>(
    (newGame) => {
      return axios.post("/api/games", newGame);
    }
  );

  const onSubmit = (newGame: INewGame) => {
    return mutation.mutate(newGame);
  };

  return (
    <Layout>
      <>
        <Typography variant="h3">New Game</Typography>
        <Box sx={{ mt: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="column">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "300px" }}
                    label={"Name"}
                    type={"text"}
                    required
                  />
                )}
              />
              <LoadingButton
                loading={mutation.isLoading}
                type="submit"
                sx={{ width: "200px", mt: 2 }}
                variant="contained"
              >
                Créer le compte
              </LoadingButton>
            </Grid>
          </form>
        </Box>
        {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      </>
    </Layout>
  );
}

function ErrorAlert({ message }: { message: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const onClose = () => setIsOpen(false);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={6000}
      onClose={onClose}
      open={isOpen}
    >
      <Alert onClose={onClose} severity="error" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
