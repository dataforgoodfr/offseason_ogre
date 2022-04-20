import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";

const CustomAutocomplete = styled(Autocomplete)(() => ({
  marginBottom: "1rem",

  "& .MuiOutlinedInput-root": {
    backgroundColor: "#1A3D5C",
    border: "1px solid #AFAFAF",
    color: "#AFAFAF",
    borderRadius: "0.8rem",
    padding: 0,

    "&.Mui-focused fieldset": {
      borderColor: "#AFAFAF",
      border: "0px",
    },

    "&:hover fieldset": {
      border: 0,
    },
  },

  "& .MuiInputBase-input": {
    padding: 0,
    border: 0,
  },

  "& label.Mui-focused": {
    color: "#AFAFAF",
  },

  "& .MuiSvgIcon-root": {
    color: "#AFAFAF",
  },

  "& .MuiInputLabel-root": {
    color: "#AFAFAF",
    top: -7,
    left: 0,
  },
}));

export default CustomAutocomplete;
