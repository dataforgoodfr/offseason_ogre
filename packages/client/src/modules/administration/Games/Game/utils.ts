import { profile } from "console";
import { useParams } from "react-router-dom";
import {
  Condition,
  formValues,
  PersoForm,
  Question,
} from "../../../play/Personalization/models/form";
import { compare } from "../../../play/Personalization/utils/formValidation";
import { Row } from "./FormVerification";

export const useGameId = () => {
  const { id } = useParams();
  if (!id) throw new Error("game id must be defined");
  const gameId = +id;
  return gameId;
};

export const getBooleanOptions = () => {
  return [
    {
      value: true,
      label: "Oui",
    },
    {
      value: false,
      label: "Non",
    },
  ];
};

export const getDropdownOptions = (values: string[]) => {
  return values.map((option: string) => ({
    value: option,
    label: option,
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

export const numericParser = (value: number) => {
  return value && value < 0 ? 0 : value;
};

export const isCredible = (fieldName: keyof PersoForm, row: Row) => {
  const question = formValues.find((q: Question) => q.name === fieldName);
  console.log("question", question);
  console.log("credibility", question?.credibilityConditions);
  if (!question || !question.credibilityConditions) {
    return true;
  }
  return question.credibilityConditions.some(
    (condition: Condition) =>
      !compare(row[condition.question as keyof PersoForm], condition)
  );
};

export const getCellCredibility = (fieldName: keyof PersoForm, row: Row) => {
  console.log(fieldName, row);
  if (!isCredible(fieldName, row)) {
    return "not-credible-cell";
  }
  return "credible-cell";
};
