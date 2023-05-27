import { useMutation, useQueryClient } from "react-query";
import { http } from "../../../../../utils/request";

export const useRemovePlayerMutation = (gameId: number) => {
  const queryClient = useQueryClient();

  const removePlayerMutation = useMutation<
    Response,
    { message: string },
    { userId: number }
  >(
    ({ userId }) => {
      return http.post("/api/games/remove-player", { gameId, userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
      },
    }
  );

  return { removePlayerMutation };
};
