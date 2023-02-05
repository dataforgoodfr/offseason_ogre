import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled, Theme } from "@mui/material/styles";

import { getStyledProps, ThemeVariant } from "../../../../utils/theme";

interface CustomTextFieldProps {
  themeVariant?: ThemeVariant;
  variant?: TextFieldProps["variant"];
}

const CustomTextField = styled(
  TextField,
  getStyledProps("themeVariant", "variant")
)<CustomTextFieldProps>(
  ({ theme, themeVariant = "dark", variant = "outlined" }) => {
    const commonStyle = {
      marginBottom: "1rem",
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
      color: themeVariant === "dark" ? theme.palette.grey[500] : "auto",
      borderRadius: "0.8rem",
      height: "40px",
      minHeight: "40px",
      maxHeight: "40px",

      fieldset: {
        borderColor: themeVariant === "dark" ? theme.palette.grey[500] : "auto",
        border: 0,
      },
      "&:hover fieldset": {
        borderColor: themeVariant === "dark" ? theme.palette.grey[500] : "auto",
      },
    },

    "& .MuiInputBase-input": {
      backgroundColor:
        themeVariant === "dark" ? theme.palette.primary.main : "white",
      border:
        "1px solid " +
        (themeVariant === "dark" ? theme.palette.grey[500] : "auto"),
      borderRadius: "0.8rem",
      height: "40px",
      padding: 0,
      paddingLeft: "7.5px",
    },

    "& label.Mui-focused": {
      color: themeVariant === "dark" ? theme.palette.grey[500] : "auto",
    },

    "& .MuiInputLabel-root": {
      color: themeVariant === "dark" ? theme.palette.grey[500] : "auto",
      top: -7,
      left: 0,
    },
  };
}

function getStyleStandard(theme: Theme, themeVariant: ThemeVariant) {
  return {
    "& .MuiOutlinedInput-root": {
      fieldset: {
        border: 0,
        borderBottom: "1px solid" + theme.palette.grey[500],
        borderRadius: 0,
      },
      "&:hover fieldset": {
        borderColor: themeVariant === "dark" ? theme.palette.grey[500] : "auto",
      },
    },

    "& .MuiInputBase-input": {
      height: "40px",
      padding: 0,
    },

    "& label.Mui-focused": {
      color: themeVariant === "dark" ? theme.palette.grey[500] : "auto",
    },

    "& .MuiInputLabel-root": {
      color: themeVariant === "dark" ? theme.palette.grey[500] : "auto",
      top: -7,
      left: -14,
    },
  };
}

export default CustomTextField;
