import { TextFieldProps } from "@mui/material";
import { Controller } from "react-hook-form";

import SelectCountry from "../../../signup/components/SelectCountry";
import CustomTextField from "../../../signup/components/CustomTextField";
import { ThemeVariant } from "../../../../utils/theme";

interface FormInputProps {
  control: any;
  name: string;
  label: string;
  themeVariant?: ThemeVariant;
  variant?: TextFieldProps["variant"];
}

const FormInput = ({
  control,
  name,
  label,
  themeVariant = "dark",
  variant = "outlined",
}: FormInputProps) => {
  if (name === "country") {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <SelectCountry
            field={field}
            label={label}
            themeVariant={themeVariant}
            variant={variant}
          />
        )}
      />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <CustomTextField
          {...field}
          sx={{ width: "300px" }}
          label={label}
          type={name === "email" ? "email" : "text"}
          required
          color="secondary"
          themeVariant={themeVariant}
          variant={variant}
        />
      )}
    />
  );
};

export default FormInput;
