import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export { ProductionStepDetails };

const ProductionStepDetails = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    display: "grid",
    gridTemplateColumns: "6fr 4fr",
    gap: theme.spacing(3),
  },
}));
