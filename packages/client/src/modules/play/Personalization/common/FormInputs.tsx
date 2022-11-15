import { ExpandMoreRounded } from "@mui/icons-material";
import { MenuItem } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { PersoForm } from "../models/form";
import { PersoTextField, PersoSelectTextField } from "../styles/form";

export { PersoFormNumberInput, PersoFormInputList };

const PersoFormNumberInput = ({
  control,
  name,
}: {
  control: Control<PersoForm, any>;
  name: keyof PersoForm;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <PersoTextField
          {...field}
          onChange={(e) => field.onChange(parseInt(e.target.value))}
          type="number"
          required
        />
      )}
    />
  );
};

const PersoFormInputList = ({
  control,
  name,
  options,
  type,
}: {
  control: Control<PersoForm, any>;
  name: keyof PersoForm;
  options: { value: any; description: any }[];
  type: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <PersoSelectTextField
          select
          {...field}
          onChange={(e) =>
            field.onChange(
              type === "number" ? parseInt(e.target.value) : e.target.value
            )
          }
          SelectProps={{
            IconComponent: ExpandMoreRounded,
          }}
        >
          {options.map((option: any) => (
            <MenuItem value={option.value}> {option.description} </MenuItem>
          ))}
        </PersoSelectTextField>
      )}
    />
  );
};
