import { Box, TextField, Grid, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { SuccessAlert, ErrorAlert } from "../../../alert";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { IGame } from "../../../../utils/types";
import { http } from "../../../../utils/request";
import { useForm } from "../../../common/hooks/useForm";
import CheckboxController from "../../../common/components/CheckboxController/CheckboxController";
import { useDialog } from "../../../common/hooks/useDialog";
import { Dialog } from "../../../common/components/Dialog";
import { useTranslation } from "../../../translations";
import { Button } from "../../../common/components/Button";
import { getTeamQueryPath } from "./services/queries";

export { GameInfo };

interface IGameFormProps {
  name: string;
  description?: string;
  date: string | Date;
  isTest: boolean;
}

interface IInfoProps {
  game: IGame;
}

function GameInfo(props: IInfoProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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
  const document = query?.data?.data?.data || [];
  const teacher =
    document.firstName && document.lastName
      ? `${document.firstName} ${document.lastName}`
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
        queryClient.invalidateQueries([`/api/games/${props.game.id}`]);
        queryClient.invalidateQueries(`/api/games/${props.game.id}/players`);
        queryClient.invalidateQueries(getTeamQueryPath(props.game.id));
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
    <Box sx={{ mt: 2 }}>
      {mutation.isSuccess && <SuccessAlert />}
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      <form onSubmit={handleSubmit(onFormValid)}>
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
            <Grid item xs={12}>
              <CheckboxController
                control={control}
                name="isTest"
                label="Atelier test"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ float: "right", pb: 4, pr: 4 }}>
          <Button htmlType="submit" iconName="save">
            <Typography>{t("cta.save")}</Typography>
          </Button>
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
