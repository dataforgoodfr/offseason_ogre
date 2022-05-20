import { Box } from "@mui/material";
import { Game } from "../../../utils/types";
import Launch from "./Launch";

export { Animation };

function Animation({ game }: { game: Game }) {
  const buttonParams = {
    message: "Animer",
    variant: "contained",
    color: "secondary",
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Launch
        buttonParams={buttonParams}
        gameId={game.id}
        gameStatus={game.status}
      />
    </Box>
  );
}
