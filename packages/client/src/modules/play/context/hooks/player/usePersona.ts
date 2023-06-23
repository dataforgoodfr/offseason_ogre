import { buildPersona } from "../../../utils/persona";
import { buildInitialPersona } from "../../../../persona/persona";
import { usePlay } from "../../playContext";
import { useCurrentPlayer } from "./useCurrentPlayer";

export { usePersona };

function usePersona() {
  const { consumptionActionById, game, productionActionById } = usePlay();
  const { player, playerActions, teamActions } = useCurrentPlayer();

  const personalization = player.profile.personalization;

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
