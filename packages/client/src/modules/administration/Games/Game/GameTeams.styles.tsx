import { Box, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export { TeamTextField, DataGridBox };

const TeamTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color: theme.palette.secondary.contrastText,
  },
  "& label.Mui-focused": {
    color: theme.palette.secondary.contrastText,
  },
  "& legend": {
    color: theme.palette.secondary.contrastText,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.secondary.main,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.secondary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.secondary.main,
    },
  },
  "& .MuiInputBase-input": {
    color: theme.palette.secondary.contrastText,
  },
})) as typeof TextField;

const DataGridBox = styled(Box)(({ theme }) => ({
  height: 500,
  width: "100%",
  "& .form-draft": {
    backgroundColor: "white",
    color: "black",
  },
  "& .form-validated": {
    backgroundColor: "green",
    color: "white",
  },
  "& .form-to-validate": {
    backgroundColor: "red",
    color: "white",
  },
}));
