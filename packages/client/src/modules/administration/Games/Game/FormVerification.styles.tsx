import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export { DataGridBox };

const DataGridBox = styled(Box)(({ theme }) => ({
  height: 500,
  width: "100%",
  "& .not-credible-cell": {
    backgroundColor: theme.palette.primary.contrastText,
  },
  "& .form-validated": {
    color: "green",
  },
  "& .form-pending-validation": {
    color: "red",
  },
}));
