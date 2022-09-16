import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CircularProgress } from "@mui/material";
import * as React from "react";
import { useMatch } from "react-router-dom";
import {
  IGame,
  ITeamWithPlayers,
  Player,
  PlayerActions,
  TeamAction,
} from "../../../utils/types";
import { useAuth } from "../../auth/authProvider";
import { persona as basePersona } from "../../persona/persona";
import { GameStep, STEPS } from "../constants";
import { sortBy } from "../../../lib/array";
import { buildPersona } from "../utils/persona";
import { computePlayerActionsStats } from "../utils/playerActions";
import { getTeamActionsAtCurrentStep } from "../utils/teamActions";

export {
  PlayProvider,
  RootPlayProvider,
  useCurrentStep,
  useMyTeam,
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
  }: {
    teamActions?: {
      id: number;
      value: number;
    }[];
  }) => {
    socket.emit("updateTeam", {
      step: gameWithTeams.step,
      teamActions,
    });
  };

  return (
    <PlayContext.Provider
      value={{
        game: gameWithTeams,
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
  useEffect(() => {
    const newSocket = io();

    newSocket.on("resetGameState", (state) => {
      const { gameWithTeams } = state;
      setGameWithTeams(gameWithTeams);
    });

    newSocket.on("gameUpdated", ({ update }: { update: Partial<IGame> }) => {
      setGameWithTeams((previous) => {
        if (previous === null) return null;
        return { ...previous, ...update };
      });
    });

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
