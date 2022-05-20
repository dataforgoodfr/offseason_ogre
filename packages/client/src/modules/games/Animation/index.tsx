import { Box } from "@mui/material";
import { Game } from "../../../utils/types";
import Launch from "./Launch";

export { Animation };

function Animation({ game }: { game: Game }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Launch game={game} />
    </Box>
  );
}
