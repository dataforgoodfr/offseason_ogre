import { Box, Grid } from "@mui/material";
import { PlayBox } from "../Components";
import { Accordion } from "../../common/components/Accordion";
import { Icon, IconName } from "../../common/components/Icon";
import {
  formSections,
  formValues,
  PersoForm,
  Question,
} from "../Personalization/models/form";
import { fulfillsConditions } from "../Personalization/utils/formValidation";
import { QuestionLine, QuestionText } from "../Personalization/styles/form";
import { DescriptionValue } from "./Persona.styles";
import { useCurrentPlayer } from "../context/hooks/player";
import { useTranslation } from "../../translations";
import { Typography } from "../../common/components/Typography";

export { Persona };

function Persona() {
  const { t } = useTranslation(["common", "consumption-profiles"]);

  const formatValue = (value: any) => {
    if (typeof value === "boolean") {
      if (value === true) {
        return t("consumption-profiles:form.choice.boolean.yes");
      } else if (value === false) {
        return t("consumption-profiles:form.choice.boolean.no");
      }
    }
    return value;
  };

  const buildDescriptionLine = (
    value: any,
    question: Question,
    key: string
  ) => {
    return (
      <QuestionLine
        key={key}
        container
        direction="row"
        justifyContent="space-between"
      >
        <QuestionText>
          {question.icon && (
            <Icon name={question.icon as IconName} sx={{ mr: 1 }} />
          )}
          {t(`consumption-profiles:form.question.${question.name}.title`)}
        </QuestionText>
        <DescriptionValue>{formatValue(value)}</DescriptionValue>
      </QuestionLine>
    );
  };

  const buildDescriptionSection = (
    personalization: PersoForm,
    questionType: string
  ) => {
    return (
      <Grid container direction="column">
        {personalization &&
          formValues
            .filter((question: Question) => question.type === questionType)
            .filter((question: Question) =>
              fulfillsConditions(personalization, question)
            )
            .map((question: Question) =>
              buildDescriptionLine(
                personalization[question.name as keyof PersoForm],
                question,
                question.name
              )
            )}
      </Grid>
    );
  };

  const { profile } = useCurrentPlayer();

  return (
    <PlayBox>
      <Box display="flex" flexDirection="column" gap={3} paddingTop={2}>
        <Typography sx={{ textAlign: "center", mb: 2 }} variant="h3">
          {t("page.player.characteristics.title")}
        </Typography>
        <Accordion
          options={Object.entries(formSections).map(([_, value]) => {
            return {
              key: value.name,
              header: (
                <Typography alignItems="center" display="flex" variant="h6">
                  {value.titleIcon && (
                    <Icon name={value.titleIcon} sx={{ mr: 1 }} />
                  )}
                  {t(`consumption-profiles:form.section.${value.name}.title`)}
                </Typography>
              ),
              content: buildDescriptionSection(
                profile.personalization,
                value.name
              ),
            };
          })}
        />
      </Box>
    </PlayBox>
  );
}
