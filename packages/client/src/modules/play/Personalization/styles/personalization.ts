import { Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

export const CentralContainer = styled(Container)(({ theme }) => ({
  maxWidth: "80%",
  margin: `${theme.spacing(4)} auto ${theme.spacing(4)} auto !important`,
  padding: theme.spacing(4),
  backgroundColor: theme.palette.primary.main,
  border: "2px solid white",
  borderRadius: "10px",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(4),
  },
}));

export const ChoiceText = styled(Typography)(({ theme }) => ({
  color: "white",
  textAlign: "left",
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
    paddingTop: theme.spacing(2),
  },
}));

export const ChoiceButton = styled(Button)(({ theme }) => ({
  display: "flex",
  ml: "auto",
  margin: "20px auto 10px auto",
  padding: theme.spacing(2),
})) as typeof Button;
