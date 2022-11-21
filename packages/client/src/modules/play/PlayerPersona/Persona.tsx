import { Grid, Typography, useTheme } from "@mui/material";
import { PlayBox } from "../Components";
import { Accordion } from "../../common/components/Accordion";
import { Icon, IconName } from "../../common/components/Icon";
import {
  formSections,
  formValues,
  PersoForm,
  Question,
} from "../Personalization/models/form";
import { fulfillsConditionsDescription } from "../Personalization/utils/formValidation";
import { usePlay } from "../context/playContext";
import { QuestionLine, QuestionText } from "../Personalization/styles/form";
import { DescriptionValue } from "./Persona.styles";

export { Persona };

function Persona() {
  const formatValue = (value: any) => {
    if (value === true) {
      return "Oui";
    } else if (value === false) {
      return "Non";
    }
    return value;
  };

  const buildDescriptionLine = (value: any, question: Question) => {
    return (
      <QuestionLine container direction="row" justifyContent="space-between">
        <QuestionText>
          {" "}
          {question.icon && (
            <Icon name={question.icon as IconName} sx={{ mr: 1 }} />
          )}
          {question.description}
        </QuestionText>
        <DescriptionValue>{formatValue(value)}</DescriptionValue>
      </QuestionLine>
    );
  };

  const buildDescriptionSection = (
    personalization: PersoForm,
    section: string
  ) => {
    return (
      <Grid container direction="column">
        {personalization &&
          formValues
            .filter((question: Question) => question.type === section)
            .filter((question: Question) =>
              fulfillsConditionsDescription(personalization, question)
            )
            .map((question: Question) =>
              buildDescriptionLine(
                personalization[question.name as keyof PersoForm],
                question
              )
            )}
      </Grid>
    );
  };

  const { profile } = usePlay();

  return (
    <PlayBox>
      <Typography sx={{ textAlign: "center", mb: 2 }} variant="h3">
        Mes caractéristiques
      </Typography>
      <Accordion
        options={Object.entries(formSections).map(
          ([_, value]: [string, any]) => {
            return {
              key: value.name,
              header: (
                <Typography alignItems="center" display="flex" variant="h6">
                  {value.titleIcon && (
                    <Icon name={value.titleIcon} sx={{ mr: 1 }} />
                  )}
                  {value.title}
                </Typography>
              ),
              content: buildDescriptionSection(
                profile.personalization,
                value.name
              ),
              themeVariation: "orange",
            };
          }
        )}
      />
    </PlayBox>
  );
}
