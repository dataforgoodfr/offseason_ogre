import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export { ScenarioNameTextField };

const ScenarioNameTextField = styled(TextField)(({ theme }) => ({
  "& label": {
    color: "white",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& legend": {
    color: "white",
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
    color: "white",
  },
}));
