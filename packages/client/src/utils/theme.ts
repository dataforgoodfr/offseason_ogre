import { createTheme } from "@mui/material";

export { theme };

const blue = "#1A3D5C";
const yellow = "#f9c74f";

const theme = createTheme({
  palette: {
    primary: {
      main: blue,
      contrastText: yellow,
    },
    secondary: {
      main: yellow,
      contrastText: blue,
    },
  },
});
