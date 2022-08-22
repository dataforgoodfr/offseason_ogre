import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

export { CustomGrid };

const CustomGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    "--top": `${theme.variables.headerHeight.default}px`,
    position: "sticky",
    top: "var(--top)",
    height: "calc(100vh - var(--top))",
    paddingBottom: theme.spacing(2),
  },
}));
