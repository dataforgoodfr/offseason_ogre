import { Box, styled } from "@mui/material";

export { Card };

const Card = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  border: "2px solid",
  borderColor: "#ffffff",
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  overflow: "hidden",
}));
