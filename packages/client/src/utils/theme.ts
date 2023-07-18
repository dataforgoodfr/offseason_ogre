import {
  GlobalStylesProps,
  createTheme,
  responsiveFontSizes,
} from "@mui/material";

export type {
  ThemeVariant,
  EnergyPalette,
  ProductionPalette,
  MaterialsPalette,
};
export { globalStyles, theme };

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
      direct: "#4C677E",
      grey: "#6C6C6C",
      fossil: "#AF6A28",
      mixte: "#F9C74F",
      renewable: "#84BDF0",
    },
    production: {
      offshore: "#4C677E",
      nuclear: "#F65574",
      terrestrial: "#8A8256",
      total: "#4C677E",
    },
    materials: {
      steel: "#5A5766",
      cement: "#E6AA68",
      glass: "#A72608",
    },
    metals: {
      copper: "#466365",
      nickel: "#B49A67",
      manganese: "#A03E99",
      silicium: "#DE1A1A",
      other: "#7D4F50",
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
    backgrounds: {
      page: "#577590",
    },
    components: {
      button: {
        disabled: {
          backgroundColor: "#b8933a",
          color: blue,
        },
      },
      tag: {
        secondary: {
          backgroundColor: "#efefef",
          color: blue,
        },
      },
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

/**
 * Define styles and classes available in the entire app.
 *
 * This is especially useful to style translated text.
 */
const globalStyles: GlobalStylesProps["styles"] = {
  ".text-em": {
    color: `${theme.palette.secondary.main} !important`,
  },
};

export const getStyledProps = (...props: string[]) => ({
  shouldForwardProp: (prop: any) => !props.includes(prop as any),
});

declare module "@mui/material/styles" {
  interface CustomPalette {
    energy: EnergyPalette;
    production: ProductionPalette;
    materials: MaterialsPalette;
    metals: MetalsPalette;
    actionValidation: Partial<Palette["primary"]>;
    status: {
      error: string;
      success: string;
    };
    backgrounds: {
      page: string;
    };
    components: {
      button: {
        disabled: {
          backgroundColor: string;
          color: string;
        };
      };
      tag: {
        secondary: {
          backgroundColor: string;
          color: string;
        };
      };
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
  direct: string;
  grey: string;
  fossil: string;
  mixte: string;
  renewable: string;
}

interface ProductionPalette {
  offshore: string;
  nuclear: string;
  terrestrial: string;
  total: string;
}

interface MaterialsPalette {
  steel: string;
  cement: string;
  glass: string;
}

interface MetalsPalette {
  copper: string;
  nickel: string;
  manganese: string;
  silicium: string;
  other: string;
}
