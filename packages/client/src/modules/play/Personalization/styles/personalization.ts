import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Typography } from "../../../common/components/Typography";
import { Button } from "../../../common/components/Button";

export { CentralContainer, ChoiceButton, ChoiceText, CustomContainer, Title };

const CustomContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const CentralContainer = styled(Container)(({ theme }) => ({
  margin: `${theme.spacing(4)} auto ${theme.spacing(4)} auto !important`,
  padding: theme.spacing(4),
  backgroundColor: theme.palette.primary.main,
  border: "2px solid white",
  borderRadius: "10px",
}));

const Title = styled(Typography)(() => ({
  color: "white",
  textAlign: "center",
}));

const ChoiceText = styled(Typography)(({ theme }) => ({
  color: "white",
  textAlign: "left",
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
    paddingTop: theme.spacing(2),
  },
}));

const ChoiceButton = styled(Button)(({ theme }) => ({
  display: "flex",
  ml: "auto",
  margin: "20px auto 10px auto",
  padding: theme.spacing(2),
}));
