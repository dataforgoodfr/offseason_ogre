import { useEffect, useMemo } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { CustomContainer } from "./styles/personalization";
import { BackArrow } from "./common/BackArrow";
import { QuestionLine, QuestionText } from "./styles/form";
import { useForm } from "react-hook-form";
import { PersoFormInputList, PersoFormNumberInput } from "./common/FormInputs";
import {
  formSections,
  formValues,
  PersoForm,
  persoFormInputs,
  Question,
} from "./models/form";
import { Icon, IconName } from "../../common/components/Icon";
import { AccordionLayout } from "../common/AccordionLayout";
import { fulfillsConditions, isSectionValid } from "./utils/formValidation";
import { useAuth } from "../../auth/authProvider";
import { usePlay } from "../context/playContext";

export { PersonalizationForm };

function PersonalizationForm() {
  const { profile, updateProfile } = usePlay();

  const { control, getValues, handleSubmit, reset, watch } = useForm<
    PersoForm,
    any
  >({
    defaultValues: useMemo(() => {
      return profile.personalization;
    }, [profile]),
  });

  useEffect(() => {
    const values = Object.entries(profile?.personalization || {})
      .filter((property: any) => {
        const [key, _] = property;
        return persoFormInputs.includes(key);
      })
      .map((property: any) => {
        const [key, val] = property;
        return { [key]: val === null ? undefined : val };
      });
    reset(Object.assign({}, ...values));
  }, [profile]);

  const { user } = useAuth();

  const getNonNullValues = () => {
    return Object.fromEntries(
      Object.entries(getValues()).filter((response: any) => {
        const [_, value] = response;
        return value !== null && value !== undefined;
      })
    );
  };

  const getComponentType = (question: Question) => {
    if (question.inputType === "free" && question.valueType === "number") {
      return <PersoFormNumberInput control={control} name={question.name} />;
    }

    if (question.inputType === "list" && question.options) {
      return (
        <PersoFormInputList
          control={control}
          name={question.name}
          options={question.options}
          type={question.valueType}
        />
      );
    }
    throw new Error("Unsupported question type");
  };

  const buildFormLine = (question: Question) => {
    return (
      <QuestionLine container direction="row" justifyContent="space-between">
        <QuestionText>
          {" "}
          {question.icon && (
            <Icon name={question.icon as IconName} sx={{ mr: 1 }} />
          )}
          {question.description}
        </QuestionText>
        {getComponentType(question)}
      </QuestionLine>
    );
  };

  const buildFormSection = (section: string) => {
    return (
      <Grid container direction="column">
        {formValues
          .filter((question: Question) => question.type === section)
          .filter((question: Question) => fulfillsConditions(watch, question))
          .map((value: any) => buildFormLine(value))}
      </Grid>
    );
  };

  const onSubmit = () => {
    console.log("submit", getValues());
  };

  const saveDraft = () => {
    if (user) {
      updateProfile({
        userId: user?.id,
        update: {
          ...getNonNullValues(),
          personalizationType: "form",
          personalizationName: "form",
        },
      });
    }
  };

  return (
    <CustomContainer maxWidth="lg">
      <Grid container direction="row" justifyContent="space-between">
        <BackArrow />
        <Grid item display="flex">
          <Button
            color="secondary"
            variant="contained"
            onClick={() => saveDraft()}
            sx={{
              mr: "auto",
              margin: "15px 0 35px 0",
              padding: "10px 20px 10px 20px",
            }}
          >
            <Icon name="settings" sx={{ mr: 1 }} />
            Sauvegarder le brouillon
          </Button>
        </Grid>
      </Grid>
      <Typography
        variant="h5"
        color="secondary"
        sx={{ textAlign: "center", mb: 4 }}
      >
        Personnaliser mon profil
      </Typography>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        {Object.entries(formSections).map((section: any) => {
          const [_, value] = section;
          return (
            <AccordionLayout
              valid={isSectionValid(formValues, watch, value.name)}
              title={value.title}
              titleIcon={value.titleIcon}
            >
              {buildFormSection(value.name)}
            </AccordionLayout>
          );
        })}
      </form>
    </CustomContainer>
  );
}
