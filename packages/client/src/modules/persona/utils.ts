import _ from "lodash";
import {
  PersoForm,
  formValues,
  Question,
} from "../play/Personalization/models/form";
import { isNotEmpty } from "../play/Personalization/utils/choices";
import { fulfillsConditions } from "../play/Personalization/utils/formValidation";

export function sumForAndFormat<T extends { type: string; value: number }>(
  array: readonly T[],
  type: string
) {
  return _.sumBy(
    array.filter(({ type: _type }) => _type === type),
    "value"
  ).toFixed(2);
}

export function sumFor<T extends { type: string; value: number }>(
  array: readonly T[],
  type?: string
) {
  if (!type) {
    return _.sumBy(array, "value");
  }

  return _.sumBy(
    array.filter(({ type: _type }) => _type === type),
    "value"
  );
}

export function sumAllValues<T extends { type: string; value: number }>(
  array: readonly T[]
) {
  return _.sumBy(array, "value").toFixed(2);
}

export function getValueByName<T extends { name: string; value: number }>(
  array: readonly T[],
  name: string
): number {
  return array.find(({ name: _name }) => _name === name)?.value || 0;
}

export const fillPersonalization = (personalization: PersoForm) => {
  return Object.fromEntries(
    Object.entries(personalization).map(([key, value]: [string, any]) => {
      const question = formValues.find((q: Question) => q.name === key);
      if (question && !fulfillsConditions(personalization, question)) {
        return [key, question.defaultValue];
      }

      if (isNotEmpty(value)) {
        return [key, value];
      }
      return [key, question?.defaultValue];
    })
  ) as PersoForm;
};
