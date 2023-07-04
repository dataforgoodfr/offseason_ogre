import { useCallback, useMemo } from "react";
import {
  // eslint-disable-next-line no-restricted-imports
  useForm as useFormLib,
  FieldValues,
  UseFormProps,
  UseFormReturn,
  UseFormHandleSubmit,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import { formatData } from "./useForm.formatters";

export { useForm };

const useForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  props?: UseFormProps<TFieldValues, TContext>
): UseFormReturn<TFieldValues, TContext> => {
  const form = useFormLib(props);

  const handleSubmit: UseFormHandleSubmit<TFieldValues> = useCallback(
    (
      onValid: SubmitHandler<TFieldValues>,
      onInvalid?: SubmitErrorHandler<TFieldValues>
    ) => {
      return form.handleSubmit((data: TFieldValues, ...args) => {
        onValid(formatData(data), ...args);
      }, onInvalid);
    },
    [form]
  );

  const newForm = useMemo(
    () => ({
      ...form,
      handleSubmit,
    }),
    [form, handleSubmit]
  );

  return newForm;
};
