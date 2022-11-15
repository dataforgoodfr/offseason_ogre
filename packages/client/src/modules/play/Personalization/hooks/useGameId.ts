import { useParams } from "react-router-dom";

export const useGameId = () => {
  const { id } = useParams();
  if (!id) throw new Error("game id must be defined");
  const gameId = +id;
  return gameId;
};

export const buildChoices = (array: string[] | number[]) => {
  return array.map((value: string | number) => {
    return { value: value, description: value };
  });
};
