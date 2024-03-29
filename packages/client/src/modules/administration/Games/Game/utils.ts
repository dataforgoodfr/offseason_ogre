import isNaN from "lodash/isNaN";
import { useParams } from "react-router-dom";
import {
  booleanChoices,
  Condition,
  formValues,
  PersoForm,
  Question,
} from "../../../play/Personalization/models/form";
import { compare } from "../../../play/Personalization/utils/formValidation";
import { Row } from "./FormVerification";
import { pipe } from "../../../../lib/fp";
import { buildChoices } from "../../../play/Personalization/utils/choices";

export const useGameId = () => {
  const { id } = useParams();
  if (!id) throw new Error("game id must be defined");
  const gameId = +id;
  return gameId;
};

export const getBooleanOptions = () => {
  return booleanChoices.map((choice) => ({
    value: choice.value,
    label: choice.description,
  }));
};

export const getDropdownOptions = (
  values: Record<string, { value: string; description: string; order?: number }>
) => {
  return buildChoices(values).map((choice) => ({
    value: choice.value,
    label: choice.description,
  }));
};

export const formatValueOptions = ({
  value,
  field,
  api,
}: {
  value: any;
  field: string;
  api: any;
}) => {
  const colDef = api.getColumn(field);
  const option = colDef.valueOptions.find(
    ({ value: optionValue }: { value: any }) => value === optionValue
  );
  return option ? option.label : "";
};

export const numericParser = (value: number | string): number => {
  return pipe(
    value,
    (value) => (typeof value === "string" ? parseInt(value, 10) : value),
    (value) => (!value || isNaN(value) ? 0 : value),
    (value) => Math.max(value, 0)
  );
};

export const isCredible = (fieldName: keyof PersoForm, row: Row) => {
  const question = formValues.find((q: Question) => q.name === fieldName);
  if (!question || !question.credibilityConditions) {
    return true;
  }
  return question.credibilityConditions.some(
    (condition: Condition) =>
      !compare(row[condition.question as keyof PersoForm], condition)
  );
};

export const getCellCredibility = (fieldName: keyof PersoForm, row: Row) => {
  if (!isCredible(fieldName, row)) {
    return "not-credible-cell";
  }
  return "credible-cell";
};
