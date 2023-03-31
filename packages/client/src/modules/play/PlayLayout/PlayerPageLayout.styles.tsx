import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export { PageLayout };

const PageLayout = styled(Box)(({ theme }) => ({
  ".player-page-layout__header": {
    zIndex: 10,
  },
  ".player-page-layout__body": {
    zIndex: 5,
  },
  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  [theme.breakpoints.up("md")]: {
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gap: theme.spacing(2),
    ".player-page-layout__header": {
      "--top": `calc(${
        theme.variables.headerHeight.default
      }px + ${theme.spacing(4)})`,
      position: "sticky",
      top: "var(--top)",
      height: `calc(100vh - var(--top) - ${theme.spacing(4)})`,
    },
  },
}));
