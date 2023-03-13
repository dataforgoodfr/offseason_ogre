import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

export { CustomGrid };

const CustomGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));
