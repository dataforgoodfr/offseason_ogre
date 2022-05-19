import { createTheme } from "@mui/material";

export { theme, blueTheme, yellowTheme };

const blueTheme = "#1A3D5C";
const yellowTheme = "#f9c74f";

const theme = createTheme({
  palette: {
    primary: {
      main: blueTheme,
      contrastText: yellowTheme,
    },
    secondary: {
      main: yellowTheme,
      contrastText: blueTheme,
    },
  },
});
