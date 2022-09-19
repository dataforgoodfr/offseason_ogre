import { createTheme, responsiveFontSizes } from "@mui/material";

export type { ThemeVariant };
export { theme };

type ThemeVariant = "light" | "dark" | "system";

const blue = "#1A3D5C";
const yellow = "#f9c74f";
const lightBlue = "#014EA6";
const white = "#FFFFFF";

let theme = createTheme({
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
      nuclear: "#F65574",
      terrestrial: "#8A8256",
    },
    actionValidation: {
      main: lightBlue,
      contrastText: white,
      dark: "#0066ff",
    },
    status: {
      error: "#9d1d32",
      success: "#2d793a",
    },
  },
  variables: {
    headerHeight: {
      sm: 56,
      default: 64,
    },
  },
});
theme = responsiveFontSizes(theme);

export const getStyledProps = (...props: string[]) => ({
  shouldForwardProp: (prop: any) => !props.includes(prop as any),
});

declare module "@mui/material/styles" {
  interface CustomPalette {
    energy: EnergyPalette;
    production: ProductionPalette;
    actionValidation: Partial<Palette["primary"]>;
    status: {
      error: string;
      success: string;
    };
  }

  interface CustomVariables {
    headerHeight: {
      sm: number;
      default: number;
    };
  }

  interface CustomTheme {
    palette: CustomPalette;
    variables: CustomVariables;
  }

  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}

  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}

// Update the Button's color prop options
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    actionValidation: true;
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
  nuclear: string;
  terrestrial: string;
}
