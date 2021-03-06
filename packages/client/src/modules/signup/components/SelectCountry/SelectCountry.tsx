import { TextFieldProps } from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import CustomAutocomplete from "./CustomAutoComplete";
import countries from "./countries";
import CustomTextField from "../CustomTextField";
import { ThemeVariant } from "../../../../utils/theme";

export default SelectCountry;

interface SelectCountryProps {
  field: ControllerRenderProps<FieldValues, any>;
  label: string;
  themeVariant?: ThemeVariant;
  variant?: TextFieldProps["variant"];
}

function SelectCountry({
  field,
  label,
  themeVariant,
  variant,
}: SelectCountryProps) {
  return (
    <CustomAutocomplete
      themeVariant={themeVariant}
      variant={variant}
      options={countries}
      value={field.value}
      onChange={(_, value: any) => field.onChange(value)}
      isOptionEqualToValue={(option: any, value: any) =>
        option?.code === value?.code
      }
      autoHighlight
      getOptionLabel={(option: any) => option.label || ""}
      renderOption={(props, option: any) => (
        <Box
          component="li"
          sx={{
            "& > img": { mr: 2, flexShrink: 0 },
          }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={(params) => {
        return (
          <CustomTextField
            {...params}
            label={label}
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
            required
            sx={{ width: "300px" }}
            themeVariant={themeVariant}
            variant={variant}
          />
        );
      }}
    />
  );
}
