import { styled } from "@mui/material/styles";
import { getStyledProps } from "../../../../utils/theme";

export { FlexRow };

const FlexRow = styled(
  "div",
  getStyledProps("gap")
)<{ gap?: number }>(({ theme, gap = 2 }) => ({
  display: "flex",
  gap: theme.spacing(gap),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));
