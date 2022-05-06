import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Layout } from "./Layout";

export { NewGame };

function NewGame(): JSX.Element {
  const { control } = useForm({
    defaultValues: {
      name: "",
    },
  });

  return (
    <Layout>
      <>
        <Typography variant="h3">New Game</Typography>
        <Box sx={{ mt: 4 }}>
          <form>
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
              <Button
                type="submit"
                variant="contained"
                sx={{ width: "200px", mt: 2 }}
              >
                Créer le compte
              </Button>
            </Grid>
          </form>
        </Box>
      </>
    </Layout>
  );
}
