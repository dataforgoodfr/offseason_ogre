import { ExpandMoreRounded } from "@mui/icons-material";
import { MenuItem } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { DropdownOption, PersoForm } from "../models/form";
import { PersoTextField, PersoSelectTextField } from "../styles/form";

export { PersoFormNumberInput, PersoFormInputList };

const isZeroDefault = (name: keyof PersoForm) => {
  return ["heatingConsumption", "heatingInvoice"].includes(name);
};

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
      defaultValue={""}
      render={({ field }) => (
        <PersoTextField
          {...field}
          onChange={(e) => field.onChange(e.target.value)}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
          onBlur={(e) => {
            if (!e.target.value.match(/(\d)+[\.\,]?(\d)*$/)) {
              field.onChange(isZeroDefault(name) ? 0 : null);
            } else {
              const newValue = e.target.value.replace(",", ".");
              field.onChange(
                parseFloat(newValue) || (isZeroDefault(name) ? 0 : null)
              );
            }
          }}
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
  options: DropdownOption[];
  type: string;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={""}
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
          {options.map((option: { value: any; description: any }) => (
            <MenuItem value={option.value}> {option.description} </MenuItem>
          ))}
        </PersoSelectTextField>
      )}
    />
  );
};
