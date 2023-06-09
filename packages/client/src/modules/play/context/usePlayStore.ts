import { useMemo, useState } from "react";
import {
  Action,
  IEnrichedGame,
  IGame,
  ITeam,
  Player,
  ProductionAction,
} from "../../../utils/types";
import { LARGE_GAME_TEAMS, STEPS } from "../constants";
import { indexArrayBy } from "../../../lib/array";

export { usePlayStore };

function usePlayStore() {
  const [isInitialised, setIsInitialised] = useState(false);
  const [game, setGame] = useState<IGame | null>(null);
  const [consumptionActions, setConsumptionActions] = useState<Action[]>([]);
  const [productionActions, setProductionActions] = useState<
    ProductionAction[]
  >([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<ITeam[]>([]);

  const enrichedGame: IEnrichedGame | null = useMemo(() => {
    if (!game) {
      return null;
    }

    return {
      ...(game || {}),
      isLarge: teams.length > LARGE_GAME_TEAMS || false,
      isSynthesisStep: game && game.step === STEPS.length - 1,
      isGameFinished: game?.status === "finished",
      isStepFinished: game?.step === game?.lastFinishedStep,
    };
  }, [game, teams]);

  const consumptionActionById = useMemo(
    () => indexArrayBy(consumptionActions, "id"),
    [consumptionActions]
  );

  const productionActionById = useMemo(
    () => indexArrayBy(productionActions, "id"),
    [productionActions]
  );

  return {
    consumptionActions,
    consumptionActionById,
    game: enrichedGame,
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
  };
}
