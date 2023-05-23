import { useCallback, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CircularProgress } from "@mui/material";
import * as React from "react";
import { useMatch, useNavigate } from "react-router-dom";
import {
  IGame,
  ITeamWithPlayers,
  Player,
  PlayerActions,
  TeamAction,
} from "../../../utils/types";
import { useAuth } from "../../auth/authProvider";
import {
  GameStep,
  GameStepType,
  isStepOfType,
  LARGE_GAME_TEAMS,
  STEPS,
} from "../constants";
import { sortBy } from "../../../lib/array";
import { buildPersona } from "../utils/persona";
import { computePlayerActionsStats } from "../utils/playerActions";
import { getTeamActionsAtCurrentStep } from "../utils/teamActions";
import { mean } from "../../../lib/math";
import { range } from "lodash";
import { sumAllValues } from "../../persona";
import { NO_TEAM } from "../../common/constants/teams";
import { buildInitialPersona } from "../../persona/persona";

export {
  PlayProvider,
  RootPlayProvider,
  useCurrentStep,
  useMyTeam,
  useTeamValues,
  useLoadedPlay as usePlay,
  usePersonaByUserId,
  usePlayerActions,
  useTeamActions,
  usePersona,
};

export type { TeamIdToValues };

interface TeamIdToValues {
  [k: string]: TeamValues;
}
interface TeamValues {
  id: number;
  playerCount: number;
  points: number;
  budget: number;
  budgetSpent: number;
  carbonFootprint: number;
  carbonFootprintReduction: number;
  stepToConsumption: {
    [k: string]: number;
  };
  stepToProduction: {
    [k: string]: number;
  };
}

interface IPlayContext {
  game: IEnrichedGame;
  isGameFinished: boolean;
  isStepFinished: boolean;
  updateGame: (update: Partial<IGame>) => void;
  updatePlayerActions: (
    update: {
      isPerformed: boolean;
      id: number;
    }[]
  ) => void;
  setActionPointsLimitExceeded: (limitExceeded: boolean) => void;
  player: PlayerState;
  updatePlayer: (options: { hasFinishedStep?: boolean }) => void;
  profile: any;
  readProfile: () => void;
  updateProfile: (
    options: { userId: number; update: any },
    onRespond?: (args: { success: boolean }) => void
  ) => void;
  updateTeam: (update: {
    teamActions?: {
      id: number;
      value: number;
    }[];
    scenarioName?: string;
  }) => void;
}
type IEnrichedGame = IGame & {
  teams: ITeamWithPlayers[];
  isLarge?: boolean;
  isSynthesisStep?: boolean;
};

interface PlayerState {
  hasFinishedStep: boolean;
  actionPointsLimitExceeded: boolean;
  playerActions: PlayerActions[];
  teamActions: TeamAction[];
}

const PlayContext = React.createContext<IPlayContext | null>(null);

function RootPlayProvider({ children }: { children: React.ReactNode }) {
  const isPlayRoute = useMatch(`play/games/:gameId/*`);
  if (!isPlayRoute) {
    return <PlayContext.Provider value={null}>{children}</PlayContext.Provider>;
  }
  return <PlayProvider>{children}</PlayProvider>;
}

function PlayProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const match = useMatch(`play/games/:gameId/*`);
  if (!match) throw new Error("Provider use outside of game play.");
  const gameId = +(match.params.gameId as string);

  const [gameWithTeams, setGameWithTeams] = useState<IEnrichedGame | null>(
    null
  );
  const [player, setPlayer] = useState<PlayerState>({
    hasFinishedStep: true,
    actionPointsLimitExceeded: false,
    playerActions: [],
    teamActions: [],
  });
  const [profile, setProfile] = useState<any>({});
  const { socket } = useGameSocket({
    gameId,
    setGameWithTeams,
    setPlayer,
    setProfile,
  });

  const gameWithSortedTeams = useMemo(
    () => enrichTeams(gameWithTeams),
    [gameWithTeams]
  );

  const readProfile = useCallback(() => {
    if (user?.id) {
      socket?.emit("readProfile", { gameId, userId: user.id });
    }
  }, [gameId, socket, user]);

  const setActionPointsLimitExceeded = useCallback(
    (actionPointsLimitExceeded: boolean) => {
      setPlayer((previous) => ({ ...previous, actionPointsLimitExceeded }));
    },
    [setPlayer]
  );

  if (gameWithSortedTeams === null || socket === null) {
    return <CircularProgress color="secondary" sx={{ margin: "auto" }} />;
  }

  const updateGame = (update: Partial<IGame>) => {
    setGameWithTeams((previous) => {
      if (previous === null) return null;
      return { ...previous, ...update };
    });
    socket.emit("updateGame", { gameId, update });
  };

  const updatePlayerActions = (
    playerActions: {
      isPerformed: boolean;
      id: number;
    }[]
  ) => {
    if (player.hasFinishedStep) {
      return;
    }

    socket.emit("updatePlayerActions", {
      gameId,
      step: gameWithSortedTeams.step,
      playerActions,
    });
  };

  const updatePlayer = ({ hasFinishedStep }: { hasFinishedStep?: boolean }) => {
    socket.emit("updatePlayer", { gameId, hasFinishedStep });
  };

  const updateProfile = (
    {
      userId,
      update,
    }: {
      userId: number;
      update: any;
    },
    onRespond?: (args: { success: boolean }) => void
  ) => {
    socket.emit("updateProfile", { gameId, userId, update }, onRespond);
  };

  const updateTeam = ({
    teamActions,
    scenarioName,
  }: {
    teamActions?: {
      id: number;
      value: number;
    }[];
    scenarioName?: string;
  }) => {
    socket.emit("updateTeam", {
      step: gameWithSortedTeams.step,
      teamActions,
      scenarioName,
    });
  };

  return (
    <PlayContext.Provider
      value={{
        game: gameWithSortedTeams,
        isGameFinished: gameWithSortedTeams.status === "finished",
        isStepFinished:
          gameWithSortedTeams.step === gameWithSortedTeams.lastFinishedStep,
        updateGame,
        updatePlayerActions,
        setActionPointsLimitExceeded,
        player,
        updatePlayer,
        profile,
        readProfile,
        updateProfile,
        updateTeam,
      }}
    >
      {children}
    </PlayContext.Provider>
  );
}

function enrichTeams(gameWithTeams: IEnrichedGame | null) {
  if (gameWithTeams !== null) {
    return {
      ...gameWithTeams,
      teams: [...(gameWithTeams?.teams ?? [])]
        .filter(({ name }) => name !== NO_TEAM)
        .sort(sortBy("id", "asc")),
      isLarge:
        (gameWithTeams && gameWithTeams.teams.length > LARGE_GAME_TEAMS) ||
        false,
      isSynthesisStep: gameWithTeams && gameWithTeams.step === STEPS.length - 1,
    };
  }
  return null;
}

function useLoadedPlay(): IPlayContext {
  const playValue = usePlay();
  if (playValue === null) {
    throw new Error("play context should have been loaded");
  }
  return playValue;
}

function useMyTeam(): ITeamWithPlayers | null {
  const { game: gameWithTeams } = useLoadedPlay();
  const { user } = useAuth();
  if (!user) return null;
  if (!gameWithTeams) return null;
  return (
    gameWithTeams.teams.find((team) =>
      team.players.some((player) => player.userId === user.id)
    ) ?? null
  );
}

function useTeamValues(): {
  teamValues: TeamValues[];
  getTeamById: (id: number | undefined) => TeamValues | undefined;
} {
  const { game } = useLoadedPlay();
  const userIds: number[] = [];
  game.teams.map((team) =>
    team.players.map(({ user }) => userIds.push(user?.id))
  );
  const personaByUserId = usePersonaByUserId(userIds);

  const teamValues = game.teams.map((team) => ({
    id: team.id,
    playerCount: team.players.length,
    points: mean(
      team.players.map(
        ({ userId }) => personaByUserId[userId].currentPersona.points
      )
    ),
    budget: mean(
      team.players.map(
        ({ userId }) => personaByUserId[userId].currentPersona.budget
      )
    ),
    budgetSpent: mean(
      team?.players
        .map(({ userId }) => personaByUserId[userId])
        .map(
          (persona) =>
            persona.getPersonaAtStep(0).budget - persona.currentPersona.budget
        )
    ),
    carbonFootprint: mean(
      team.players.map(
        ({ userId }) => personaByUserId[userId].currentPersona.carbonFootprint
      )
    ),
    carbonFootprintReduction: mean(
      team?.players
        .map(({ userId }) => personaByUserId[userId])
        .map(
          (persona) =>
            (1 -
              persona.currentPersona.carbonFootprint /
                persona.getPersonaAtStep(0).carbonFootprint) *
            100
        )
    ),
    stepToConsumption: buildStepToData(
      "consumption",
      game,
      team,
      personaByUserId
    ),
    stepToProduction: buildStepToData(
      "production",
      game,
      team,
      personaByUserId
    ),
  }));

  const getTeamById = (id: number | undefined) => {
    return teamValues.find((t) => t.id === id);
  };

  return {
    teamValues,
    getTeamById,
  };
}

function buildStepToData(
  dataType: GameStepType,
  game: IGame,
  team: ITeamWithPlayers,
  personaByUserId: ReturnType<typeof usePersonaByUserId>
) {
  return Object.fromEntries(
    range(0, game.lastFinishedStep + 1)
      .filter((step) => isStepOfType(step, dataType))
      .map((step: number) => [
        step,
        buildStepData(dataType, step, team, personaByUserId),
      ])
  );
}

function buildStepData(
  dataType: GameStepType,
  step: number,
  team: ITeamWithPlayers,
  personaByUserId: ReturnType<typeof usePersonaByUserId>
) {
  return mean(
    team.players
      .map(
        ({ user }) => personaByUserId[user.id].getPersonaAtStep(step)[dataType]
      )
      .map((data) =>
        parseInt(sumAllValues(data as { type: string; value: number }[]))
      )
  );
}

function useCurrentStep(): GameStep | null {
  const playValue = usePlay();
  if (!playValue) {
    throw new Error("play context should have been loaded");
  }
  const game = playValue.game;
  return STEPS?.[game.step] || null;
}

function usePlayerActions() {
  const { game, player } = useLoadedPlay();

  return {
    playerActions: player.playerActions,
    actionPointsAvailableAtCurrentStep: STEPS[game.step].availableActionPoints,
    ...computePlayerActionsStats(game.step, player.playerActions),
  };
}

function useTeamActions() {
  const { game, player } = useLoadedPlay();

  return {
    teamActions: player.teamActions,
    teamActionsAtCurrentStep: getTeamActionsAtCurrentStep(
      game.step,
      player.teamActions
    ),
  };
}

function useGameSocket({
  gameId,
  setGameWithTeams,
  setPlayer,
  setProfile,
}: {
  gameId: number;
  setGameWithTeams: React.Dispatch<React.SetStateAction<IEnrichedGame | null>>;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}): { socket: Socket | null } {
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const newSocket = io();

    newSocket.on("resetGameState", (state) => {
      const { gameWithTeams } = state;
      setGameWithTeams(gameWithTeams);
    });

    newSocket.on(
      "gameUpdated",
      ({ update }: { update: Partial<IEnrichedGame> }) => {
        setGameWithTeams((previous) => {
          if (previous === null) return null;
          if (previous.status !== "finished" && update.status === "finished") {
            navigate("/play");
          }

          if (
            update.lastFinishedStep &&
            update.lastFinishedStep !== previous.lastFinishedStep
          ) {
            navigate(`/play/games/${previous.id}/persona/stats`);
          }
          return { ...previous, ...update };
        });
      }
    );

    newSocket.on(
      "playerActionsUpdated",
      ({ playerActions = [] }: { playerActions: PlayerActions[] }) => {
        setPlayer((previous) => ({
          ...previous,
          playerActions: playerActions.sort(sortBy("actionId", "asc")),
        }));
      }
    );

    newSocket.on("actionPointsLimitExceeded", () => {
      setPlayer((previous) => ({
        ...previous,
        actionPointsLimitExceeded: true,
      }));
    });

    newSocket.on(
      "playerUpdated",
      ({ update }: { update: Partial<PlayerState> }) => {
        setPlayer((previous) => ({ ...previous, ...update }));
      }
    );

    newSocket.on("profileUpdated", ({ update }: { update: Partial<any> }) => {
      setProfile((previous: any) => ({ ...previous, ...update }));
    });

    newSocket.on("connect", () => {
      newSocket.emit("joinGame", gameId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [gameId, setGameWithTeams, setPlayer, setProfile, navigate]);
  return { socket };
}

function usePlay() {
  return React.useContext<IPlayContext | null>(PlayContext);
}

function usePersonaByUserId(userIds: number): ReturnType<typeof buildPersona>;
function usePersonaByUserId(
  userIds: number[]
): Record<number, ReturnType<typeof buildPersona>>;
function usePersonaByUserId(userIds: number | number[]) {
  const { game: gameWithTeams } = useLoadedPlay();

  if (typeof userIds === "number") {
    const { team, player } = getUserTeamAndPlayer(gameWithTeams, userIds);
    const personalization = player?.profile.personalization;
    const teamActions = team?.actions || [];
    const initialPersona = buildInitialPersona(
      player?.profile.personalization,
      teamActions
    );
    return buildPersona(
      gameWithTeams,
      personalization,
      initialPersona,
      player?.actions || [],
      teamActions
    );
  }

  return Object.fromEntries(
    userIds.map((userId) => {
      const { team, player } = getUserTeamAndPlayer(gameWithTeams, userId);
      const personalization = player?.profile.personalization;
      const teamActions = team?.actions || [];
      const initialPersona = buildInitialPersona(personalization, teamActions);
      return [
        userId,
        buildPersona(
          gameWithTeams,
          personalization,
          initialPersona,
          player?.actions || [],
          teamActions
        ),
      ];
    })
  );
}

function getUserTeamAndPlayer(game: IEnrichedGame, userId: number) {
  const team = game.teams.find((team: ITeamWithPlayers) =>
    team.players.find((player: Player) => player.userId === userId)
  );

  const player = team?.players.find(
    (player: Player) => player.userId === userId
  );

  return { team, player };
}

function usePersona() {
  const { game, player } = useLoadedPlay();
  const { user } = useAuth();
  const profile = user && getUserTeamAndPlayer(game, user.id)?.player?.profile;
  const { playerActions } = usePlayerActions();
  const initialPersona = buildInitialPersona(
    profile.personalization,
    player.teamActions
  );

  return buildPersona(
    game,
    profile.personalization,
    initialPersona,
    playerActions,
    player.teamActions
  );
}
