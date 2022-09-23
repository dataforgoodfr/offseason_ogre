import { useEffect, useState } from "react";
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
import { persona as basePersona } from "../../persona/persona";
import {
  GameStep,
  GameStepType,
  getCurrentStep,
  isStepOfType,
  STEPS,
} from "../constants";
import { sortBy } from "../../../lib/array";
import { buildPersona } from "../utils/persona";
import { computePlayerActionsStats } from "../utils/playerActions";
import { getTeamActionsAtCurrentStep } from "../utils/teamActions";
import { mean } from "../../../lib/math";
import { range, sum } from "lodash";
import { sumAllValues } from "../../persona";

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

interface IPlayContext {
  game: IGameWithTeams;
  updateGame: (update: Partial<IGame>) => void;
  playerActions: PlayerActions[];
  updatePlayerActions: (
    update: {
      isPerformed: boolean;
      id: number;
    }[]
  ) => void;
  actionPointsLimitExceeded: boolean;
  setActionPointsLimitExceeded: (limitExceeded: boolean) => void;
  player: PlayerState;
  updatePlayer: (options: { hasFinishedStep?: boolean }) => void;
  updateTeam: (update: {
    teamActions?: {
      id: number;
      value: number;
    }[];
    scenarioName?: string;
  }) => void;
}
type IGameWithTeams = IGame & { teams: ITeamWithPlayers[] };

interface PlayerState {
  hasFinishedStep: boolean;
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
  const match = useMatch(`play/games/:gameId/*`);
  if (!match) throw new Error("Provider use ouside of game play.");
  const gameId = +(match.params.gameId as string);

  const [gameWithTeams, setGameWithTeams] = useState<IGameWithTeams | null>(
    null
  );
  const [playerActions, setPlayerActions] = useState<PlayerActions[]>([]);
  const [actionPointsLimitExceeded, setActionPointsLimitExceeded] =
    useState<boolean>(false);
  // TODO: move actionPointsLimitExceeded and playerActions to this state.
  const [player, setPlayer] = useState<PlayerState>({
    hasFinishedStep: true,
    teamActions: [],
  });
  const { socket } = useGameSocket({
    gameId,
    setGameWithTeams,
    setPlayerActions,
    setActionPointsLimitExceeded,
    setPlayer,
  });

  if (gameWithTeams === null || socket === null) {
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
      step: gameWithTeams.step,
      playerActions,
    });
  };

  const updatePlayer = ({ hasFinishedStep }: { hasFinishedStep?: boolean }) => {
    socket.emit("updatePlayer", { gameId, hasFinishedStep });
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
      step: gameWithTeams.step,
      teamActions,
      scenarioName,
    });
  };

  const gameWithSortedTeams = {
    ...gameWithTeams,
    teams: gameWithTeams.teams.sort(
      (a: ITeamWithPlayers, b: ITeamWithPlayers) => a.id - b.id
    ),
  };

  return (
    <PlayContext.Provider
      value={{
        game: gameWithSortedTeams,
        updateGame,
        playerActions,
        updatePlayerActions,
        actionPointsLimitExceeded,
        setActionPointsLimitExceeded,
        player,
        updatePlayer,
        updateTeam,
      }}
    >
      {children}
    </PlayContext.Provider>
  );
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

function useTeamValues() {
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
    teamValues: teamValues,
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
    range(0, getCurrentStep(game) + 1)
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
  const scaleFactor = dataType === "consumption" ? team.players.length || 1 : 1;

  return (
    sum(
      team.players
        .map(
          ({ user }) =>
            personaByUserId[user.id].getPersonaAtStep(step)[dataType]
        )
        .map((data) =>
          parseInt(sumAllValues(data as { type: string; value: number }[]))
        )
    ) / scaleFactor
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
  const { game, playerActions } = useLoadedPlay();

  return {
    playerActions,
    actionPointsAvailableAtCurrentStep: STEPS[game.step].availableActionPoints,
    ...computePlayerActionsStats(game.step, playerActions),
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
  setPlayerActions,
  setActionPointsLimitExceeded,
  setPlayer,
}: {
  gameId: number;
  setGameWithTeams: React.Dispatch<React.SetStateAction<IGameWithTeams | null>>;
  setPlayerActions: React.Dispatch<React.SetStateAction<PlayerActions[]>>;
  setActionPointsLimitExceeded: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
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
      ({ update }: { update: Partial<IGameWithTeams> }) => {
        setGameWithTeams((previous) => {
          if (previous === null) return null;
          if (previous.status !== "finished" && update.status === "finished") {
            navigate("/");
          }
          return { ...previous, ...update };
        });
      }
    );

    newSocket.on(
      "playerActionsUpdated",
      ({ playerActions = [] }: { playerActions: PlayerActions[] }) => {
        setPlayerActions(playerActions.sort(sortBy("actionId", "asc")));
      }
    );

    newSocket.on("actionPointsLimitExceeded", () => {
      setActionPointsLimitExceeded(true);
    });

    newSocket.on(
      "playerUpdated",
      ({ update }: { update: Partial<PlayerState> }) => {
        setPlayer((previous) => ({ ...previous, ...update }));
      }
    );

    newSocket.on("connect", () => {
      newSocket.emit("joinGame", gameId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [
    gameId,
    setGameWithTeams,
    setPlayerActions,
    setActionPointsLimitExceeded,
    setPlayer,
  ]);
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
    return buildPersona(
      gameWithTeams,
      basePersona,
      player?.actions || [],
      team?.actions || []
    );
  }

  return Object.fromEntries(
    userIds.map((userId) => {
      const { team, player } = getUserTeamAndPlayer(gameWithTeams, userId);
      return [
        userId,
        buildPersona(
          gameWithTeams,
          basePersona,
          player?.actions || [],
          team?.actions || []
        ),
      ];
    })
  );
}

function getUserTeamAndPlayer(game: IGameWithTeams, userId: number) {
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
  const { playerActions } = usePlayerActions();

  return buildPersona(game, basePersona, playerActions, player.teamActions);
}
