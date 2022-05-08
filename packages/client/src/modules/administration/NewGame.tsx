import { LoadingButton } from "@mui/lab";
import { Box, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { ErrorAlert, SuccessAlert } from "../alert";
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

  const onValid = (newGame: INewGame) => mutation.mutate(newGame);

  return (
    <Layout>
      <>
        <Typography variant="h3">Nouvel atelier</Typography>
        <Box sx={{ mt: 4 }}>
          <form onSubmit={handleSubmit(onValid)}>
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
                Créer l'atelier.
              </LoadingButton>
            </Grid>
          </form>
        </Box>
        {mutation.isError && <ErrorAlert message={mutation.error.message} />}
        {mutation.isSuccess && <SuccessAlert />}
      </>
    </Layout>
  );
}
