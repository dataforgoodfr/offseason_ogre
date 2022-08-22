import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

export { CustomDialogActions, CustomGrid };

const CustomDialogActions = styled(DialogActions)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  padding: "0 24px 16px",

  [theme.breakpoints.up("sm")]: {
    padding: "12px 24px 16px",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  "> *": {
    margin: "0 !important",
  },
}));

const CustomGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  "> *": {
    margin: "0 !important",
  },
}));
