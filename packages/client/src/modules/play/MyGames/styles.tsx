import { Container, Divider, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export { CustomContainer, CustomDivider, CustomPaper, GameItemHost };

const CustomContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(4),
  },
}));

const CustomDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(4),
  "&::before, &::after": {
    borderColor: theme.palette.secondary.light,
  },
  [theme.breakpoints.down("sm")]: {
    ".MuiDivider-wrapper": {
      padding: 0,
    },
    "&::before, &::after": {
      display: "none",
    },
  },
}));

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  [theme.breakpoints.up("sm")]: {
    width: "443px",
  },
}));

const GameItemHost = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  [theme.breakpoints.down("sm")]: {
    "> *:not(:first-of-type)": {
      marginTop: theme.spacing(2),
    },
  },
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));
