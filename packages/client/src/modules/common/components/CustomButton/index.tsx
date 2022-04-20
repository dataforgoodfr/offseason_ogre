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
  backgroundColor: "#F9C74F",
  color: "#1A3D5C",
  borderRadius: "0.5rem",
  width: theme.width,
  height: "43px",
  alignSelf: "center",
  "&:hover": {
    backgroundColor: "#F9C74F",
    color: "#1A3D5C",
    opacity: 0.9,
  },
}));

export default CustomButton;
