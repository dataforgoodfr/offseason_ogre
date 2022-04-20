import Button from "@mui/material/Button";
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

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.main,
  borderRadius: "0.5rem",
  height: "43px",
  alignSelf: "center",
  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    opacity: 0.9,
  },
}));

export default CustomButton;
