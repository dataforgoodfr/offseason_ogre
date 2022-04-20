import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    width: string;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    width?: string;
  }
}

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: "1rem",

  "& .MuiOutlinedInput-root": {
    color: "#AFAFAF",
    borderRadius: "0.8rem",

    "&.Mui-focused fieldset": {
      borderColor: "#AFAFAF",
      border: "0px",
    },
    "&:hover fieldset": {
      borderColor: "#AFAFAF",
    },
  },

  "& .MuiInputBase-input": {
    backgroundColor: "#1A3D5C",
    border: "1px solid #AFAFAF",
    borderRadius: "0.8rem",
    height: "40px",
    padding: 0,
    paddingLeft: "7.5px",
  },

  "& label.Mui-focused": {
    color: "#AFAFAF",
  },

  "& .MuiInputLabel-root": {
    color: "#AFAFAF",
    top: -7,
    left: 0,
  },
}));

export default CustomTextField;
