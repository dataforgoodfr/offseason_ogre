import { Grid, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const QuestionLine = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: "0 20px 0",
  [theme.breakpoints.down("sm")]: {
    gridTemplateRows: "auto auto",
    gap: theme.spacing(2),
  },
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "3fr 1fr",
    gap: theme.spacing(2),
    ".question-line": {
      "&__text-wrapper, &__input-wrapper": {
        display: "flex",
        alignItems: "center",
      },
    },
  },
}));

export const QuestionText = styled(Typography)(({ theme }) => ({
  alignItems: "center",
}));

export const PersoTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
})) as typeof TextField;

export const PersoSelectTextField = styled(PersoTextField)(({ theme }) => ({
  width: "100%",
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
})) as typeof TextField;
