import { PlayerActions } from "../../../utils/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { usePlay } from "../context/playContext";

export { usePlayerActions };

function usePlayerActions() {
  const queryClient = useQueryClient();
  const { game } = usePlay();

  const query = useQuery(["actions", game.id], async ({ queryKey }) => {
    const [_, gameId]: [string, number, number] = queryKey as any;
    if (!gameId) {
      return [];
    }

    const res = await axios.get<
      undefined,
      { data: { playerActions: PlayerActions[] } }
    >(`/api/actions/me?gameId=${gameId}`);

    return res?.data?.playerActions || [];
  });

  const mutation = useMutation<
    Response,
    { message: string },
    { id: number; isPerformed: boolean }[]
  >(
    (playerActions: { id: number; isPerformed: boolean }[]) => {
      const path = `/api/actions/me`;
      return axios.put(path, { playerActions });
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["actions", game.id]),
    }
  );

  const playerActions = query.data || [];
  const playerActionsAtCurrentStep = playerActions.filter(
    (pa) => pa.action.step === game.step
  );
  const actionPointsUsedAtCurrentStep = playerActionsAtCurrentStep.reduce(
    (sum, pa) => (pa.isPerformed ? sum + pa.action.actionPointCost : sum),
    0
  );

  return {
    playerActions,
    playerActionsAtCurrentStep,
    actionPointsUsedAtCurrentStep,
    query,
    mutation,
  };
}
