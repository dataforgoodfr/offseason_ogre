import { createTheme } from "@mui/material";

export type { ThemeVariant };
export { theme };

type ThemeVariant = "light" | "dark" | "system";

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
    energy: {
      grey: "#6C6C6C",
      fossil: "#AF6A28",
      mixte: "#F9C74F",
      renewable: "#84BDF0",
    },
    production: {
      offshore: "#4C677E",
      terrestrial: "#8A8256",
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    energy: EnergyPalette;
    production: ProductionPalette;
  }
  interface PaletteOptions {
    energy: EnergyPalette;
    production: ProductionPalette;
  }
}

interface EnergyPalette {
  grey: string;
  fossil: string;
  mixte: string;
  renewable: string;
}

interface ProductionPalette {
  offshore: string;
  terrestrial: string;
}
