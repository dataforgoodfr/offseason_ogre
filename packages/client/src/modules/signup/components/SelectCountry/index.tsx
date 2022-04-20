import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CustomAutocomplete from "./CustomAutoComplete";
import countries from "./countries";

function SelectCountry({ field, label }: { field: any; label: string }) {
  return (
    <CustomAutocomplete
      options={countries}
      onChange={(_, value: any) => field.onChange(value)}
      autoHighlight
      getOptionLabel={(option: any) => option.label}
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
          <TextField
            {...params}
            label={label}
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
            required
          />
        );
      }}
    />
  );
}

export default SelectCountry;
