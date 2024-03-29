import { TextFieldProps } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { styled, Theme } from "@mui/material/styles";

import { getStyledProps, ThemeVariant } from "../../../../utils/theme";

interface CustomAutocompleteProps {
  themeVariant?: ThemeVariant;
  variant?: TextFieldProps["variant"];
}

const CustomAutocomplete = styled(
  Autocomplete,
  getStyledProps("themeVariant", "variant")
)<CustomAutocompleteProps>(
  ({ theme, themeVariant = "dark", variant = "outlined" }) => {
    const commonStyle = {
      marginBottom: "1rem",
      height: "40px",
    };

    const style = styleFactory(variant)(theme, themeVariant);

    return { ...commonStyle, ...style };
  }
);

function styleFactory(variant: TextFieldProps["variant"]) {
  if (variant === "outlined") {
    return getStyleOutlined;
  }
  return getStyleStandard;
}

function getStyleOutlined(theme: Theme, themeVariant: ThemeVariant) {
  return {
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
      paddingTop: "0 !important",
      paddingBottom: "0 !important",
      border: "0 !important",
      height: "40px !important",
      backgroundColor: "transparent !important",
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
  };
}

function getStyleStandard(theme: Theme, themeVariant: ThemeVariant) {
  return {
    "& .MuiOutlinedInput-root": {
      padding: 0,

      "&:hover fieldset": {
        borderColor: theme.palette.grey[900],
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.secondary.main,
      },
    },

    "& .MuiInputBase-input": {
      padding: "0 !important",
      border: "0 !important",
      height: "40px !important",
      backgroundColor: "transparent !important",
    },

    "&.Mui-focused label": {
      color: theme.palette.secondary.main,
    },
  };
}

export default CustomAutocomplete;
