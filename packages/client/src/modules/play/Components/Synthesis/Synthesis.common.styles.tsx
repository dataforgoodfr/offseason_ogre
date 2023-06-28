import { styled } from "@mui/material";
import { Card } from "../../../common/components/Card";

export { CardStyled };

const CardStyled = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));
