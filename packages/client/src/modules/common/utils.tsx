import { Box } from "@mui/material";
import { theme } from "../../utils/theme";
import { IGame } from "../../utils/types";
import { getStepIndexById } from "../play";

export function roundValue(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function hasNuclear(game: IGame) {
  return game.step >= getStepIndexById("production-3");
}

export function emphasizeText(text: string) {
  return (
    <Box component="span" sx={{ color: theme.palette.secondary.main }}>
      {text}
    </Box>
  );
}
