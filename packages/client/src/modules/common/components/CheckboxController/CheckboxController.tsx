import { FormControlLabel } from "@mui/material";
import CheckboxLib from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

const CheckboxController = <T extends FieldValues>({
  control,
  name,
  label,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControlLabel
          control={<CustomCheckbox {...field} checked={field.value} />}
          label={label}
        />
      )}
    />
  );
};

const CustomCheckbox = styled(CheckboxLib)(({ theme }) => ({
  path: {
    color: theme.palette.components.checkbox.fillColor,
    fill: theme.palette.components.checkbox.fillColor,
  },
}));

export default CheckboxController;
