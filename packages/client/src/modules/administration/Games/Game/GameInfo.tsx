import { Box, TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { SuccessAlert, ErrorAlert } from "../../../alert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { IGame } from "../../../../utils/types";
import { http } from "../../../../utils/request";
import { useForm } from "../../../common/hooks/useForm";
import { Button } from "../../../common/components/Button";

export { GameInfo };

interface IGameFormProps {
  name: string;
  description?: string;
  date: string | Date;
}

interface IInfoProps {
  game: IGame;
}

function GameInfo(props: IInfoProps) {
  const queryClient = useQueryClient();

  const query = useQuery(`/api/users/${props.game.teacherId}`, () => {
    return http.get<undefined, { data: { data: any } }>(
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
      return http.put(path, formattedGame);
    },
    {
      onSuccess: (data, game) =>
        queryClient.invalidateQueries([`/api/games/${props.game.id}`]),
    }
  );

  const onValid = (game: IGameFormProps) => {
    mutation.mutate(game);
  };

  return (
    <Box>
      {mutation.isSuccess && <SuccessAlert />}
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      <form onSubmit={handleSubmit(onValid)}>
        <Grid container direction="column" spacing={2} sx={{ pl: 3, pt: 3 }}>
          <Grid container direction="row">
            <Grid item xs={6} sx={{ pr: 2 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "100%", mb: 3 }}
                    label={"Nom atelier"}
                    type={"text"}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} sx={{ pl: 2 }}>
              <TextField
                value={teacher}
                sx={{ width: "100%", mb: 3 }}
                label={"Animateur assigné"}
                type={"text"}
                disabled
              />
            </Grid>
            <Grid item xs={6} sx={{ pr: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  control={control}
                  name="date"
                  render={({ field: { ref, ...fieldProps } }) => (
                    <DateTimePicker
                      mask=""
                      inputFormat="dd/MM/yyyy HH:mm"
                      {...fieldProps}
                      inputRef={ref}
                      label="Date de l'atelier"
                      value={fieldProps.value}
                      onChange={(e) => fieldProps.onChange(e)}
                      renderInput={(params) => (
                        <TextField {...params} sx={{ mb: 3 }} fullWidth />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "100%", mb: 3 }}
                    label={"Description"}
                    type={"text"}
                    multiline
                    rows={4}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid display="flex" justifyContent="end">
          <Button htmlType="submit" iconName="save">
            Enregistrer
          </Button>
        </Grid>
      </form>
    </Box>
  );
}
