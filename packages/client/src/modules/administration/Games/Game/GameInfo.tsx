import { Box, TextField, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ReactNode, useCallback, useState } from "react";
import { ErrorAlert } from "../../../alert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { IGameWithTeams } from "../../../../utils/types";
import { http } from "../../../../utils/request";
import { useForm } from "../../../common/hooks/useForm";
import CheckboxController from "../../../common/components/CheckboxController/CheckboxController";
import { useDialog } from "../../../common/hooks/useDialog";
import { Dialog } from "../../../common/components/Dialog";
import { useTranslation } from "../../../translations";
import { Button } from "../../../common/components/Button";
import { getTeamQueryPath } from "./services/queries";
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
  isTest: boolean;
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
  const { t } = useTranslation();

  const {
    isOpen: isModeSwitchDialogOpen,
    closeDialog: closeModeSwitchDialog,
    openDialog: openModeSwitchDialog,
  } = useDialog();

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

  const { handleSubmit, control, getValues } = useForm({
    defaultValues: {
      name: props.game?.name || "",
      date: props.game?.date || new Date(),
      description: props.game?.description || "",
      isTest: !!props.game?.isTest,
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
        queryClient.invalidateQueries(`/api/games/${props.game.id}/players`);
        queryClient.invalidateQueries(getTeamQueryPath(props.game.id));
        props.onSave();
      },
    }
  );

  const onFormValid = (game: IGameFormProps) => {
    if (game.isTest !== props.game.isTest) {
      openModeSwitchDialog();
    } else {
      updateGame();
    }
  };

  const updateGame = () => {
    const game = getValues();
    mutation.mutate(game);
  };

  return (
    <Box>
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      <form onSubmit={handleSubmit(onFormValid)}>
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
            <Grid item xs={12}>
              <CheckboxController
                control={control}
                name="isTest"
                label="Atelier test"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid display="flex" gap={2}>
          <Button htmlType="submit" iconName="save">
            {t("cta.save")}
          </Button>
          {props.additionalActions}
        </Grid>
      </form>

      <Dialog
        open={isModeSwitchDialogOpen}
        handleClose={closeModeSwitchDialog}
        content={
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography>
              Changer le mode de jeu supprime tou.te.s les joueur.euse.s et les
              équipes. L'opération est irréversible.
            </Typography>
            <Typography>Voulez-vous changer le mode de jeu ?</Typography>
          </Box>
        }
        actions={
          <>
            <Button type="secondary" onClick={closeModeSwitchDialog}>
              {t("cta.cancel")}
            </Button>
            <Button
              onClick={() => {
                closeModeSwitchDialog();
                updateGame();
              }}
            >
              {t("cta.confirm")}
            </Button>
          </>
        }
      />
    </Box>
  );
}
