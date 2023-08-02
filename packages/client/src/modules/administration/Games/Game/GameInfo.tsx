import { Box, TextField, Grid } from "@mui/material";
import { ReactNode, useCallback, useState } from "react";
import { Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorAlert } from "../../../alert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { IGameWithTeams } from "../../../../utils/types";
import { http } from "../../../../utils/request";
import { useForm } from "../../../common/hooks/useForm";
import { Button } from "../../../common/components/Button";
import { Typography } from "../../../common/components/Typography";
import { Icon } from "../../../common/components/Icon";
import { CopyToClipboard } from "../../../common/components/CopyToClipboard";
import { Launch } from "./components/Launch";
import { useAlerts } from "../../../alert/AlertProvider";

export { GameInfo };

interface IGameFormProps {
  name: string;
  description?: string;
  date: string | Date;
}

interface GameInfoProps {
  game: IGameWithTeams;
}

interface GameInfoStateProps {
  game: IGameWithTeams;
  additionalActions: ReactNode;
}

function GameInfo({ game }: GameInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = useCallback(
    () => setIsEditing((previous) => !previous),
    [setIsEditing]
  );

  return isEditing ? (
    <GameInfoEdit
      game={game}
      additionalActions={
        <>
          <Button type="secondary" onClick={toggleEditing}>
            Annuler
          </Button>
        </>
      }
      onSave={toggleEditing}
    />
  ) : (
    <GameInfoRead
      game={game}
      additionalActions={
        <>
          <Button type="secondary" iconName="edit" onClick={toggleEditing}>
            Éditer
          </Button>
        </>
      }
    />
  );
}

function GameInfoRead({ additionalActions, game }: GameInfoStateProps) {
  const query = useQuery(`/api/users/${game.teacherId}`, () => {
    return http.get<undefined, { data: { data: any } }>(
      `/api/users/${game.teacherId}`
    );
  });
  const teacher = query?.data?.data?.data || null;
  const teacherName =
    teacher?.firstName && teacher?.lastName
      ? `${teacher?.firstName} ${teacher?.lastName}`
      : "";

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography bold>{game?.name}</Typography>
        {game?.date && (
          <Box display="flex" alignItems="center" gap={1}>
            <Icon name="date" />
            <Typography>
              Date : Le {new Date(game?.date).toLocaleDateString()} à{" "}
              {new Date(game?.date).toLocaleTimeString()}
            </Typography>
          </Box>
        )}
        <Box display="flex" alignItems="center" gap={1} width="fit-content">
          <Icon name="code" />
          <Typography>Code :</Typography>
          <CopyToClipboard value={game?.code}></CopyToClipboard>
        </Box>
        {game?.description && <Typography>{game?.description}</Typography>}
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Typography>Animateur.ice : {teacherName}</Typography>
      </Box>

      {game && (
        <Box display="flex" alignItems="center" gap={2}>
          <Launch game={game} />
          {additionalActions}
        </Box>
      )}
    </Box>
  );
}

function GameInfoEdit(props: {
  game: IGameWithTeams;
  additionalActions: ReactNode;
  onSave: () => void;
}) {
  const queryClient = useQueryClient();
  const { enqueueAlert } = useAlerts();

  const query = useQuery(`/api/users/${props.game.teacherId}`, () => {
    return http.get<undefined, { data: { data: any } }>(
      `/api/users/${props.game.teacherId}`
    );
  });
  const teacher = query?.data?.data?.data || null;
  const teacherName =
    teacher?.firstName && teacher?.lastName
      ? `${teacher?.firstName} ${teacher?.lastName}`
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
      onSuccess: () => {
        enqueueAlert({ severity: "success" });
        queryClient.invalidateQueries([`/api/games/${props.game.id}`]);
        props.onSave();
      },
    }
  );

  const onValid = (game: IGameFormProps) => {
    mutation.mutate(game);
  };

  return (
    <Box>
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      <form onSubmit={handleSubmit(onValid)}>
        <Grid container direction="column" gap={3} mb={2}>
          <Grid container direction="row" gap={2}>
            <Grid item flexGrow={1}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "100%" }}
                    label={"Nom atelier"}
                    type={"text"}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item flexGrow={1}>
              <TextField
                value={teacherName}
                sx={{ width: "100%" }}
                label={"Animateur assigné"}
                type={"text"}
                disabled
              />
            </Grid>
          </Grid>
          <Grid container direction="row" gap={2}>
            <Grid item flexGrow={1}>
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
                        <TextField {...params} fullWidth />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Grid container direction="row" gap={2}>
            <Grid item flexGrow={1}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    sx={{ width: "100%" }}
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

        <Grid display="flex" gap={2}>
          <Button htmlType="submit" iconName="save">
            Enregistrer
          </Button>
          {props.additionalActions}
        </Grid>
      </form>
    </Box>
  );
}
