import { Controller } from "react-hook-form";
import SelectCountry from "../../../signup/components/SelectCountry";
import CustomTextField from "../../../signup/components/CustomTextField";

interface FormInputProps {
  control: any;
  name: string;
  label: string;
}

const FormInput = ({ control, name, label }: FormInputProps) => {
  if (name === "country") {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => <SelectCountry field={field} label={label} />}
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
          sx={{ width: "280px" }}
          label={label}
          type={name === "email" ? "email" : "text"}
          required
          color="secondary"
        />
      )}
    />
  );
};

export default FormInput;
