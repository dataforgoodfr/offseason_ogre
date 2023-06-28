import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export { ScenarioNameTextField };

const ScenarioNameTextField = styled(TextField)(() => ({
  flexGrow: 1,
  width: "100%",
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
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
  },
}));
