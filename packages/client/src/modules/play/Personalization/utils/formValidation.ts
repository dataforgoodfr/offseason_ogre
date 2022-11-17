import { Condition, Question } from "../models/form";
import { isNotEmpty } from "./choices";

const compare = (watch: any, condition: any) => {
  if (condition.operator === ">") {
    return watch(condition.question) > condition.value;
  }
  if (condition.operator === "<") {
    return watch(condition.question) < condition.value;
  }
  if (condition.operator === "=") {
    return watch(condition.question) === condition.value;
  }
  return false;
};

export const fulfillsConditions = (watch: any, question: Question) => {
  if (!question.conditions) {
    return true;
  }
  return question.conditions.every((condition: Condition) =>
    compare(watch, condition)
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
      if (fulfillsConditions(watch, question)) {
        return isNotEmpty(watch(question.name));
      }
      return true;
    });
};
