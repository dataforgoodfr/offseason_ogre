import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export const useRemovePlayerMutation = (gameId: number) => {
  const queryClient = useQueryClient();

  const removePlayerMutation = useMutation<
    Response,
    { message: string },
    { userId: number }
  >(
    ({ userId }) => {
      return axios.post("/api/games/remove-player", { gameId, userId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/api/games/${gameId}/players`);
      },
    }
  );

  return { removePlayerMutation };
};
