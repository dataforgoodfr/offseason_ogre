import { useCallback, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CircularProgress } from "@mui/material";
import * as React from "react";
import { useMatch, useNavigate } from "react-router-dom";
import {
  Action,
  IEnrichedGame,
  IGame,
  ITeam,
  Player,
  ProductionAction,
} from "../../../utils/types";
import { useAuth } from "../../auth/authProvider";
import { GameStep, GameStepType, isStepOfType, STEPS } from "../constants";
import { buildPersona } from "../utils/persona";
import { mean } from "../../../lib/math";
import { range } from "lodash";
import { sumAllValues } from "../../persona";
import { buildInitialPersona } from "../../persona/persona";
import { WEB_SOCKET_URL } from "../../common/constants";
import { usePlayStore } from "./usePlayStore";
import { updateCollection } from "./playContext.utils";

export {
  RootPlayProvider,
  useCurrentStep,
  useMyTeam,
  useTeamValues,
  useLoadedPlay as usePlay,
  usePersonaByUserId,
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
  consumptionActions: Action[];
  consumptionActionById: Record<number, Action>;
  game: IEnrichedGame;
  players: Player[];
  productionActions: ProductionAction[];
  productionActionById: Record<number, ProductionAction>;
  teams: ITeam[];
  updateGame: (update: Partial<IGame>) => void;
  updatePlayerActions: (
    update: {
      isPerformed: boolean;
      id: number;
    }[]
  ) => void;
  setActionPointsLimitExceeded: (limitExceeded: boolean) => void;
  updatePlayer: (options: { hasFinishedStep?: boolean }) => void;
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

const PlayContext = React.createContext<IPlayContext | null>(null);

function RootPlayProvider({ children }: { children: React.ReactNode }) {
  const isPlayRoute = useMatch(`play/games/:gameId/*`);
  if (!isPlayRoute) {
    return <PlayContext.Provider value={null}>{children}</PlayContext.Provider>;
  }
  return <PlayProvider>{children}</PlayProvider>;
}

function PlayProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const match = useMatch(`play/games/:gameId/*`);

  const gameId = useMemo(() => {
    return +(match?.params.gameId as string) || 0;
  }, [match?.params.gameId]);

  const {
    consumptionActions,
    consumptionActionById,
    game,
    isInitialised,
    players,
    productionActions,
    productionActionById,
    teams,
    setConsumptionActions,
    setGame,
    setIsInitialised,
    setPlayers,
    setProductionActions,
    setTeams,
  } = usePlayStore();
  const { socket } = useGameSocket({
    gameId,
    token,
    setConsumptionActions,
    setGame,
    setIsInitialised,
    setPlayers,
    setProductionActions,
    setTeams,
  });

  const readProfile = useCallback(() => {
    if (user?.id) {
      socket?.emit("profile:read");
    }
  }, [socket, user]);

  const setActionPointsLimitExceeded = useCallback(
    (actionPointsLimitExceeded: boolean) => {
      setPlayers(([player]) => [{ ...player, actionPointsLimitExceeded }]);
    },
    [setPlayers]
  );

  if (!isInitialised || !game || !socket) {
    return <CircularProgress color="secondary" sx={{ margin: "auto" }} />;
  }

  const updateGame = (update: Partial<IGame>) => {
    setGame((previous) => {
      if (previous === null) return null;
      return { ...previous, ...update };
    });
    socket.emit("game:update", { update });
  };

  const updatePlayerActions = (
    playerActions: {
      isPerformed: boolean;
      id: number;
    }[]
  ) => {
    if (players[0].hasFinishedStep) {
      return;
    }

    socket.emit("player-actions:update", {
      step: game.step,
      playerActions,
    });
  };

  const updatePlayer = ({ hasFinishedStep }: { hasFinishedStep?: boolean }) => {
    socket.emit("player:update", { hasFinishedStep });
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
    socket.emit("profile:update", { gameId, userId, update }, onRespond);
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
      step: game.step,
      teamActions,
      scenarioName,
    });
  };

  return (
    <PlayContext.Provider
      value={{
        consumptionActions,
        consumptionActionById,
        game,
        players,
        productionActions,
        productionActionById,
        teams,
        updateGame,
        updatePlayerActions,
        setActionPointsLimitExceeded,
        updatePlayer,
        readProfile,
        updateProfile,
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

function useMyTeam(): ITeam | null {
  const { players, teams } = useLoadedPlay();
  const { user } = useAuth();

  const myTeam = useMemo(() => {
    if (!user || !teams.length) {
      return null;
    }

    const myPlayer = players.find((p) => p.userId === user?.id);
    if (!myPlayer) {
      return null;
    }

    return teams.find((t) => t.id === myPlayer.teamId) || null;
  }, [players, teams, user]);

  return myTeam;
}

function useTeamValues(): {
  teamValues: TeamValues[];
  getTeamById: (id: number | undefined) => TeamValues | undefined;
} {
  const { game, players, teams } = useLoadedPlay();

  const userIds: number[] = useMemo(
    () => players.map((p) => p.userId),
    [players]
  );
  const personaByUserId = usePersonaByUserId(userIds);

  const teamValues = useMemo(() => {
    return teams.map((team) => {
      const playersInTeam = players.filter((p) => p.teamId === team.id);

      return {
        id: team.id,
        playerCount: playersInTeam.length,
        points: mean(
          playersInTeam.map(
            ({ userId }) => personaByUserId[userId].currentPersona.points
          )
        ),
        budget: mean(
          playersInTeam.map(
            ({ userId }) => personaByUserId[userId].currentPersona.budget
          )
        ),
        budgetSpent: mean(
          playersInTeam
            .map(({ userId }) => personaByUserId[userId])
            .map(
              (persona) =>
                persona.getPersonaAtStep(0).budget -
                persona.currentPersona.budget
            )
        ),
        carbonFootprint: mean(
          playersInTeam.map(
            ({ userId }) =>
              personaByUserId[userId].currentPersona.carbonFootprint
          )
        ),
        carbonFootprintReduction: mean(
          playersInTeam
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
          playersInTeam,
          personaByUserId
        ),
        stepToProduction: buildStepToData(
          "production",
          game,
          playersInTeam,
          personaByUserId
        ),
      };
    });
    // TODO: check `personaByUserId` in deps doesn't trigger infinite renders.
  }, [game, personaByUserId, players, teams]);

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
  players: Player[],
  personaByUserId: ReturnType<typeof usePersonaByUserId>
) {
  return Object.fromEntries(
    range(0, game.lastFinishedStep + 1)
      .filter((step) => isStepOfType(step, dataType))
      .map((step: number) => [
        step,
        buildStepData(dataType, step, players, personaByUserId),
      ])
  );
}

function buildStepData(
  dataType: GameStepType,
  step: number,
  players: Player[],
  personaByUserId: ReturnType<typeof usePersonaByUserId>
) {
  return mean(
    players
      .map((p) => personaByUserId[p.userId].getPersonaAtStep(step)[dataType])
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

function useGameSocket({
  gameId,
  token,
  setConsumptionActions,
  setGame,
  setIsInitialised,
  setPlayers,
  setProductionActions,
  setTeams,
}: {
  gameId: number;
  token: string | null;
  setConsumptionActions: React.Dispatch<React.SetStateAction<Action[]>>;
  setGame: React.Dispatch<React.SetStateAction<IGame | null>>;
  setIsInitialised: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setProductionActions: React.Dispatch<
    React.SetStateAction<ProductionAction[]>
  >;
  setTeams: React.Dispatch<React.SetStateAction<ITeam[]>>;
}): { socket: Socket | null } {
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(WEB_SOCKET_URL, {
      withCredentials: true,
      auth: {
        token,
      },
    });

    newSocket.on("game:init", (state) => {
      setConsumptionActions(state.consumptionActions);
      setGame(state.game);
      setPlayers(state.players);
      setProductionActions(state.productionActions);
      setTeams(state.teams);
      setIsInitialised(true);
    });

    newSocket.on("game:update", ({ update }: { update: Partial<IGame> }) => {
      setGame((previous) => {
        if (previous === null) {
          return null;
        }
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
    });

    newSocket.on(
      "player-actions:update",
      ({
        updates,
      }: {
        updates: (Partial<Player> & Pick<Player, "userId">)[];
      }) => {
        setPlayers((players) => updateCollection(players, "userId", updates));
      }
    );

    newSocket.on(
      "player-actions:action-points-limit-exceeded",
      ({
        updates,
      }: {
        updates: (Partial<Player> & Pick<Player, "userId">)[];
      }) => {
        setPlayers((players) => updateCollection(players, "userId", updates));
      }
    );

    newSocket.on(
      "player:update",
      ({
        updates,
      }: {
        updates: (Partial<Player> & Pick<Player, "userId">)[];
      }) => {
        setPlayers((players) => updateCollection(players, "userId", updates));
      }
    );

    newSocket.on(
      "team:update",
      ({ updates }: { updates: (Partial<ITeam> & Pick<ITeam, "id">)[] }) => {
        setTeams((teams) => updateCollection(teams, "id", updates));
      }
    );

    newSocket.on("connect", () => {
      newSocket.emit("game:join", gameId);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [
    gameId,
    token,
    /**
     * Don't include `navigate` in dependencies since it changes on every route change,
     * which trigger a socket disconnection and reconnection.
     * @see https://github.com/remix-run/react-router/issues/7634
     *
     * /!\ Only use absolute navigation inside of this `useEffect`!
     */
    // navigate,
    setConsumptionActions,
    setGame,
    setIsInitialised,
    setPlayers,
    setProductionActions,
    setTeams,
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
  const { consumptionActionById, game, players, productionActionById, teams } =
    useLoadedPlay();

  if (typeof userIds === "number") {
    const { team, player } = getUserTeamAndPlayer(userIds, { players, teams });
    const personalization = player?.profile?.personalization!;
    const teamActions = team?.actions || [];
    const initialPersona = buildInitialPersona(
      personalization,
      teamActions,
      productionActionById
    );
    return buildPersona(
      game,
      personalization,
      initialPersona,
      player?.actions || [],
      consumptionActionById,
      teamActions,
      productionActionById
    );
  }

  return Object.fromEntries(
    userIds.map((userId) => {
      const { team, player } = getUserTeamAndPlayer(userId, { players, teams });
      const personalization = player?.profile?.personalization!;
      const teamActions = team?.actions || [];
      const initialPersona = buildInitialPersona(
        personalization,
        teamActions,
        productionActionById
      );
      return [
        userId,
        buildPersona(
          game,
          personalization,
          initialPersona,
          player?.actions || [],
          consumptionActionById,
          teamActions,
          productionActionById
        ),
      ];
    })
  );
}

function getUserTeamAndPlayer(
  userId: number,
  { players, teams }: { players: Player[]; teams: ITeam[] }
) {
  const player = players.find((p) => p.userId === userId) || null;

  let team = null;
  if (player) {
    team = teams.find((t) => t.id === player.teamId) || null;
  }

  return { team, player };
}
