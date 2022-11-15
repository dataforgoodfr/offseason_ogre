import { Grid, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const QuestionLine = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  alignItems: "center",
  padding: "0 2% 0 2%",
}));

export const QuestionText = styled(Typography)(({ theme }) => ({
  maxWidth: "75%",
  marginBottom: theme.spacing(2),
  alignItems: "center",
  padding: "0 2% 0 2%",
}));

export const PersoTextField = styled(TextField)(({ theme }) => ({
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
