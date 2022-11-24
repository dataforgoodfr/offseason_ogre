import {
  Condition,
  formSections,
  formValues,
  PersoForm,
  Question,
} from "../models/form";
import { isNotEmpty } from "./choices";

const compare = (currentValue: any, condition: any) => {
  if (condition.operator === ">") {
    return currentValue > condition.value;
  }
  if (condition.operator === "<") {
    return currentValue < condition.value;
  }
  if (condition.operator === "=") {
    return currentValue === condition.value;
  }
  if (condition.operator === "!=") {
    return currentValue !== condition.value;
  }
  return false;
};

export const fulfillsConditionsForm = (watch: any, question: Question) => {
  if (!question.conditions) {
    return true;
  }
  return question.conditions.every((condition: Condition) =>
    compare(watch(condition.question), condition)
  );
};

export const fulfillsConditions = (
  personalization: PersoForm,
  question: Question
) => {
  if (!question.conditions) {
    return true;
  }
  return question.conditions.every((condition: Condition) =>
    compare(personalization[condition.question as keyof PersoForm], condition)
  );
};

export const isSectionValid = (
  formValues: Question[],
  watch: any,
  sectionName: string
) => {
  return formValues
    .filter((question: Question) => question.type === sectionName)
    .every((question: Question) => {
      if (fulfillsConditionsForm(watch, question)) {
        return isNotEmpty(watch(question.name));
      }
      return true;
    });
};

export const getOrigin = (userId: number, gameId: number) => {
  return `player_${userId}_${gameId}`;
};

export const formBlockText =
  "La modification du formulaire a été bloquée par l'animateur car le délai a été dépassé.";

export const isFormValid = (watch: any) =>
  Object.entries(formSections).every(([_, value]: [string, any]) =>
    isSectionValid(formValues, watch, value.name)
  );

export const getNonNullValues = (values: any) => {
  return Object.fromEntries(
    Object.entries(values).filter(([_, value]: [string, any]) =>
      isNotEmpty(value)
    )
  );
};
