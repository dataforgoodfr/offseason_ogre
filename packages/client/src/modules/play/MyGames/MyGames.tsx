import { trim } from "lodash";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  useTheme,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorAlert, SuccessAlert } from "../../alert";
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
import { Icon } from "../../common/components/Icon";
import { Typography } from "../../common/components/Typography";

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
  const theme = useTheme();

  return (
    <PlayBox sx={{ mt: 2 }}>
      <GameItemHost>
        <Grid item xs={10}>
          <Typography variant="h6">{game.name}</Typography>
          <Typography>
            {"Date: " + new Date(game.date).toLocaleString()}
          </Typography>
        </Grid>
        {game.status === "draft" && (
          <Grid item display="flex" xs={2}>
            <Button
              component={Link}
              color="secondary"
              variant="contained"
              to={`/play/games/${game.id}/personalize/choice`}
              sx={{ display: "flex", gap: 1 }}
            >
              <Icon name="settings" sx={{ width: "1rem", height: "1rem" }} />
              <Typography as="span">{t("cta.prepare-game")}</Typography>
            </Button>
          </Grid>
        )}
        {game.status === "ready" && (
          <Grid item display="flex" xs={2}>
            <Button
              variant="contained"
              disabled
              sx={{
                display: "flex",
                gap: 1,
                backgroundColor: "#AFAFAF !important",
              }}
            >
              <Icon
                name="access-time"
                sx={{
                  width: "1rem",
                  height: "1rem",
                  color: theme.palette.primary.main,
                }}
              />
              <Typography as="span" sx={{ color: theme.palette.primary.main }}>
                {t("game.status.not-started")}
              </Typography>
            </Button>
          </Grid>
        )}
        {game.status === "playing" && (
          <Grid item display="flex" xs={2}>
            <Button
              component={Link}
              color="secondary"
              variant="contained"
              to={`/play/games/${game.id}/persona`}
              sx={{ display: "flex", gap: 1 }}
            >
              <Icon
                name="videogame-controller"
                sx={{ width: "1rem", height: "1rem" }}
              />
              <Typography as="span">{t("cta.play-game")}</Typography>
            </Button>
          </Grid>
        )}
        {game.status === "finished" && (
          <Grid item display="flex" xs={2}>
            <Button
              component={Link}
              color="secondary"
              variant="contained"
              to={`/play/games/${game.id}/persona/actions`}
              sx={{ display: "flex", gap: 1 }}
            >
              <Icon name="synthesis" sx={{ width: "1rem", height: "1rem" }} />
              <Typography as="span">{t("cta.read-synthesis")}</Typography>
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
  const { control, handleSubmit } = useForm({
    defaultValues: {
      gameCode: "",
    },
  });
  const { t } = useTranslation();

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
      },
    }
  );

  const onValid = (registration: Registration) => mutation.mutate(registration);
  return (
    <CustomPaper>
      <form onSubmit={handleSubmit(onValid)}>
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
            type="submit"
            color="secondary"
            variant="contained"
            sx={{ display: "flex", gap: 1 }}
          >
            <Icon name="launch" sx={{ width: "1rem", height: "1rem" }} />
            <Typography as="span">{t("cta.join-game")}</Typography>
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
      {mutation.isSuccess && <SuccessAlert />}
    </CustomPaper>
  );
}
