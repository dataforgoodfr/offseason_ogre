import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: "1rem",

  "& .MuiOutlinedInput-root": {
    color: theme.palette.grey[500],
    borderRadius: "0.8rem",

    "&.Mui-focused fieldset": {
      borderColor: theme.palette.grey[500],
      border: "0px",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[500],
    },
  },

  "& .MuiInputBase-input": {
    backgroundColor: theme.palette.primary.main,
    border: "1px solid " + theme.palette.grey[500],
    borderRadius: "0.8rem",
    height: "40px",
    padding: 0,
    paddingLeft: "7.5px",
  },

  "& label.Mui-focused": {
    color: theme.palette.grey[500],
  },

  "& .MuiInputLabel-root": {
    color: theme.palette.grey[500],
    top: -7,
    left: 0,
  },
}));

export default CustomTextField;
