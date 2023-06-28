import { buildPersona } from "../../../utils/persona";
import { buildInitialPersona } from "../../../../persona/persona";
import { usePlay } from "../../playContext";
import { useCurrentPlayer } from "./useCurrentPlayer";

export { usePersona };

function usePersona() {
  const { consumptionActionById, game, productionActionById } = usePlay();
  const { personalization, playerActions, teamActions } = useCurrentPlayer();

  const initialPersona = buildInitialPersona(
    personalization,
    teamActions,
    productionActionById
  );

  return buildPersona(
    game,
    personalization,
    initialPersona,
    playerActions,
    consumptionActionById,
    teamActions,
    productionActionById
  );
}
