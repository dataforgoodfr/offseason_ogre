import { trim } from "lodash";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
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
} from "./styles";
import { IGame } from "../../../utils/types";
import { handleApiError } from "../../../utils/request";
import { useTranslation } from "../../translations/useTranslation";
import { Icon } from "../../common/components/Icon";

export { MyGames };

interface Registration {
  gameCode: string;
}

function MyGames() {
  return (
    <CustomContainer maxWidth="lg">
      <Typography variant="h3" color="secondary">
        Mes ateliers
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
              sx={{ ml: "auto" }}
            >
              <Icon name="settings" sx={{ mr: 2 }} />
              Préparer l'atelier
            </Button>
          </Grid>
        )}
        {game.status === "ready" && (
          <Grid item display="flex" xs={2}>
            <Button
              variant="contained"
              disabled
              sx={{ ml: "auto", backgroundColor: "#AFAFAF !important" }}
            >
              <Icon name="access-time" sx={{ mr: 2, color: "white" }} />
              <Typography sx={{ color: "white" }}>Pas démarré</Typography>
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
              sx={{ ml: "auto" }}
            >
              <Icon name="videogame-controller" sx={{ mr: 2 }} /> Jouer
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
              sx={{ ml: "auto" }}
            >
              <Icon name="synthesis" sx={{ mr: 2 }} /> {t("cta.read-synthesis")}
            </Button>
          </Grid>
        )}
      </GameItemHost>
    </PlayBox>
  );
}

function MyGamesList() {
  const query = useQuery("/api/games/played-games", () => {
    return axios.get<undefined, { data: { games: any[] } }>(
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
        buildGameList(currentGames, "Ateliers en cours")}
      {draftGames.length > 0 && buildGameList(draftGames, "Prochains ateliers")}
      {finishedGames.length > 0 &&
        buildGameList(finishedGames, "Ateliers terminés")}
    </Box>
  );
}

function buildGameList(games: IGame[], title: string) {
  return (
    <>
      <Box>
        <Typography textAlign={"center"} variant="h5" color="secondary" mt={6}>
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
      return axios.post("/api/games/register", { gameCode });
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
          <Button type="submit" variant="contained">
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
      {mutation.isSuccess && <SuccessAlert />}
    </CustomPaper>
  );
}
