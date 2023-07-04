import { FieldValues } from "react-hook-form";

export { formatData };

const FIELD_NAME_TO_FORMATTER: Record<
  string,
  {
    formatter: (value: string) => string;
  }
> = {
  email: {
    formatter: formatEmail,
  },
};

function formatEmail(email: string = ""): string {
  return email.trim().toLowerCase();
}

function formatData<TFieldValues extends FieldValues = FieldValues>(
  data: TFieldValues
): TFieldValues {
  return Object.fromEntries(
    Object.entries(data).map(([fieldName, fieldValue]) => {
      const formatter =
        FIELD_NAME_TO_FORMATTER[fieldName]?.formatter ||
        ((value: any) => value);
      return [fieldName, formatter(fieldValue)];
    })
  ) as TFieldValues;
}
