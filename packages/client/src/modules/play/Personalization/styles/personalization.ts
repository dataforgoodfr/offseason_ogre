import { Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(4),
  },
}));

export const CentralContainer = styled(Container)(({ theme }) => ({
  width: "80%",
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
    paddingTop: "5%",
  },
}));

export const ChoiceButton = styled(Button)(({ theme }) => ({
  width: "50%",
  ml: "auto",
  margin: "5% auto 5% auto",
  padding: "5%",
  [theme.breakpoints.down("sm")]: {
    width: "85%",
  },
})) as typeof Button;
