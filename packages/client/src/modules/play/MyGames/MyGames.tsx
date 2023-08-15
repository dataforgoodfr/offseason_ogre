import { trim } from "lodash";
import { Box, CircularProgress, Grid, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorAlert } from "../../alert";
import { PlayBox } from "../Components";
import {
  CustomContainer,
  CustomDivider,
  CustomPaper,
  GameItemHost,
  JoinGameInputWrapper,
} from "./MyGames.styles";
import { IGame } from "../../../utils/types";
import { handleApiError, http } from "../../../utils/request";
import { useTranslation } from "../../translations/useTranslation";
import { Typography } from "../../common/components/Typography";
import { useAlerts } from "../../alert/AlertProvider";
import { Button } from "../../common/components/Button";
import { useForm } from "../../common/hooks/useForm";
import { formatDate } from "../../../lib/time";
import { Icon } from "../../common/components/Icon";
import { Tag } from "../../common/components/Tag";

export { MyGames };

interface Registration {
  gameCode: string;
}

function MyGames() {
  const { t } = useTranslation();

  return (
    <CustomContainer maxWidth="lg">
      <Typography variant="h3" color="#ffffff">
        {t("page.games-list.title")}
      </Typography>
      <CustomDivider>
        <JoinGame />
      </CustomDivider>
      <MyGamesList />
    </CustomContainer>
  );
}

function GameItem({ game }: { game: IGame }) {
  const { t } = useTranslation();

  return (
    <PlayBox sx={{ mt: 2 }}>
      <GameItemHost>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Tag type="secondary">{t("game.mode.test").toUpperCase()}</Tag>
            <Typography variant="h6">{game.name}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Icon name="date"></Icon>
            <Typography>
              {formatDate(game.date, "full-date-at-time")}
            </Typography>
          </Box>
        </Box>
        {game.status === "draft" && (
          <Grid item display="flex" xs={2}>
            <Button
              iconName="settings"
              to={`/play/games/${game.id}/personalize/choice`}
            >
              {t("cta.prepare-game")}
            </Button>
          </Grid>
        )}
        {game.status === "ready" && (
          <Grid item display="flex" xs={2}>
            <Button disabled iconName="access-time">
              {t("game.status.not-started")}
            </Button>
          </Grid>
        )}
        {game.status === "playing" && (
          <Grid item display="flex" xs={2}>
            <Button
              iconName="videogame-controller"
              to={`/play/games/${game.id}/persona`}
            >
              {t("cta.play-game")}
            </Button>
          </Grid>
        )}
        {game.status === "finished" && (
          <Grid item display="flex" xs={2}>
            <Button
              iconName="synthesis"
              to={`/play/games/${game.id}/persona/actions`}
            >
              {t("cta.read-synthesis")}
            </Button>
          </Grid>
        )}
      </GameItemHost>
    </PlayBox>
  );
}

function MyGamesList() {
  const { t } = useTranslation();

  const query = useQuery("/api/games/played-games", () => {
    return http.get<undefined, { data: { games: any[] } }>(
      "/api/games/played-games"
    );
  });

  if (query.isLoading) {
    return <CircularProgress />;
  }

  const games = query?.data?.data?.games ?? [];

  const draftGames = games.filter((game) =>
    ["draft", "ready"].includes(game.status)
  );
  const currentGames = games.filter((game) => game.status === "playing");
  const finishedGames = games.filter((game) => game.status === "finished");

  return (
    <Box sx={{ mt: 4 }}>
      {currentGames.length > 0 &&
        buildGameList(currentGames, t("page.games-list.ongoing-list.title"))}
      {draftGames.length > 0 &&
        buildGameList(draftGames, t("page.games-list.upcoming-list.title"))}
      {finishedGames.length > 0 &&
        buildGameList(finishedGames, t("page.games-list.finished-list.title"))}
    </Box>
  );
}

function buildGameList(games: IGame[], title: string) {
  return (
    <>
      <Box>
        <Typography textAlign={"center"} variant="h5" color="#ffffff" mt={6}>
          {title}
        </Typography>
      </Box>
      <Box>
        {games.map((game) => (
          <GameItem key={game.id} game={game} />
        ))}
      </Box>
    </>
  );
}

function JoinGame() {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      gameCode: "",
    },
  });
  const { t } = useTranslation();
  const { enqueueAlert } = useAlerts();

  const queryClient = useQueryClient();

  const mutation = useMutation<
    { data: { gameId: number } },
    { message: string },
    Registration
  >(
    ({ gameCode }) => {
      return http.post("/api/games/register", { gameCode });
    },
    {
      onSuccess: async (res) => {
        queryClient.invalidateQueries("/api/games/played-games");
        queryClient.invalidateQueries(`/api/games/${res.data.gameId}/players`);
        setValue("gameCode", "");
        enqueueAlert({
          severity: "success",
          message: t("message.success.game-joined"),
        });
      },
    }
  );

  const onSubmit = (registration: Registration) => {
    if (!registration.gameCode) {
      return;
    }

    mutation.mutate(registration);
  };

  return (
    <CustomPaper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <JoinGameInputWrapper>
          <Controller
            control={control}
            name="gameCode"
            render={({ field }) => (
              <TextField
                {...field}
                onChange={(e) =>
                  field.onChange(trim(e.target.value).toUpperCase())
                }
                label={t("form.field.game-code.label")}
                type="text"
                required
              />
            )}
          />
          <Button
            htmlType="submit"
            iconName="launch"
            loading={mutation.isLoading}
          >
            {t("cta.join-game")}
          </Button>
        </JoinGameInputWrapper>
      </form>
      {mutation.isError && (
        <ErrorAlert
          message={handleApiError(mutation.error, {
            GAME_ALREADY_STARTED: () =>
              t("message.error.register.GAME_ALREADY_STARTED"),
            GAME_NOT_FOUND: () => t("message.error.register.GAME_NOT_FOUND"),
            USER_ALREADY_JOINED_GAME: () =>
              t("message.error.register.USER_ALREADY_JOINED_GAME"),
            default: () => t("message.error.global.UNEXPECTED"),
          })}
        />
      )}
    </CustomPaper>
  );
}
