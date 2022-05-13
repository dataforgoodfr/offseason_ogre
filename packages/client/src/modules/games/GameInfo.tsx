import { Box, TextField, Grid, Button } from "@mui/material";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useEffect, useState } from "react";

export { GameInfo };

interface IGame {
  id: number;
  name: string;
  date: Date;
  teacherId: string;
  description?: string;
}

interface IGameFormProps {
  name: string;
  description?: string;
  date: Date;
}

interface IInfoProps {
  game: IGame;
}

function GameInfo(props: IInfoProps) {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      const toRef = setTimeout(() => {
        setSuccess(false);
        clearTimeout(toRef);
      }, 4000);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const toRef = setTimeout(() => {
        setError(false);
        clearTimeout(toRef);
      }, 4000);
    }
  }, [error]);

  const queryClient = useQueryClient();

  const query = useQuery("teacher", () => {
    return axios.get<undefined, { data: { data: any } }>(
      `/api/users/${props.game.teacherId}`
    );
  });
  const document = query?.data?.data?.data || [];
  const teacher =
    document.firstName && document.lastName
      ? `${document.firstName} ${document.lastName}`
      : "";

  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: props.game?.name || "",
      date: props.game?.date || new Date(),
      description: props.game?.description || "",
    },
  });

  const mutation = useMutation<Response, { message: string }, IGameFormProps>(
    (game: IGameFormProps) => {
      const formattedGame = {
        ...game,
        date: new Date(game.date),
      };
      const path = `/api/games/${props.game?.id}`;
      return axios.put(path, formattedGame);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["game", "teacher"]);
        setSuccess(true);
      },
      onError: () => {
        setError(true);
      },
    }
  );

  const onValid = (game: IGameFormProps) => {
    mutation.mutate(game);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <form onSubmit={handleSubmit(onValid)}>
        <Grid container direction="column" spacing={2} sx={{ pl: 3, pt: 3 }}>
          <Grid container direction="row">
            <Grid item xs={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "90%", mb: 3 }}
                    label={"Nom atelier"}
                    type={"text"}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={teacher}
                sx={{ width: "90%", mb: 3 }}
                label={"Animateur assigné"}
                type={"text"}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { ref, ...fieldProps } }) => (
                    <DateTimePicker
                      inputFormat="dd/MM/yyyy HH:mm"
                      {...fieldProps}
                      inputRef={ref}
                      label="Date de l'atelier"
                      value={fieldProps.value}
                      onChange={(e) => fieldProps.onChange(e)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ width: "90%", mb: 3 }}
                          fullWidth
                        />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: "90%", mb: 3 }}
                  label={"Description"}
                  type={"text"}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid sx={{ float: "right", pb: 4, pr: 4 }}>
          {!success && !error && (
            <Button type="submit" variant="contained" color="primary">
              <SaveIcon /> Enregistrer
            </Button>
          )}
          {success && !error && (
            <Button variant="contained" color="success">
              <CheckIcon />
            </Button>
          )}
          {!success && error && (
            <Button variant="contained" color="error">
              <CloseIcon /> Échec de la modification
            </Button>
          )}
        </Grid>
      </form>
    </Box>
  );
}
