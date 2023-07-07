import { useMutation, useQueryClient } from "react-query";
import { http } from "../../../../../utils/request";

export { useRemoveGameMutation, useRemovePlayerMutation };

const useRemoveGameMutation = () => {
  const queryClient = useQueryClient();

  const removeGameMutation = useMutation<
    Response,
    { message: string },
    { gameId: number }
  >(({ gameId }) => http.delete(`/api/games/${gameId}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(`games`);
    },
  });

  return { removeGameMutation };
};

const useRemovePlayerMutation = (gameId: number) => {
  const queryClient = useQueryClient();

  const removePlayerMutation = useMutation<
    Response,
    { message: string },
    { userId: number }
  >(({ userId }) => http.post("/api/games/remove-player", { gameId, userId }), {
    onSuccess: () => {
      queryClient.invalidateQueries(`/api/games/${gameId}/players`);
    },
  });

  return { removePlayerMutation };
};
