import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";

const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
  marginBottom: "1rem",

  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.primary.main,
    border: "1px solid " + theme.palette.grey[500],
    color: theme.palette.grey[500],
    borderRadius: "0.8rem",
    padding: 0,

    "&.Mui-focused fieldset": {
      borderColor: theme.palette.grey[500],
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
    color: theme.palette.grey[500],
  },

  "& .MuiSvgIcon-root": {
    color: theme.palette.grey[500],
  },

  "& .MuiInputLabel-root": {
    color: theme.palette.grey[500],
    top: -7,
    left: 0,
  },
}));

export default CustomAutocomplete;
