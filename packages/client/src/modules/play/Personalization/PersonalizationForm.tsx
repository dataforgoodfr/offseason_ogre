import { Button, Grid, Typography } from "@mui/material";
import { CustomContainer } from "./styles/personalization";
import { BackArrow } from "./common/BackArrow";
import { AccordionLayout } from "../common/AccordionLayout";
import { QuestionLine, QuestionText } from "./styles/form";
import { useForm } from "react-hook-form";
import { PersoFormInputList, PersoFormNumberInput } from "./common/FormInputs";
import { formSections, formValues, PersoForm } from "./models/form";
import { Icon } from "../../common/components/Icon";

export { PersonalizationForm };

function PersonalizationForm() {
  const { control, getValues, handleSubmit, watch } = useForm<PersoForm, any>({
    defaultValues: {
      // profileNumberAdults: 1,
      // profileCarEnergy: "Essence",
      // profileCarConsumption: 0,
      // profileCarDistanceAlone: 0,
      // profileCarDistanceHoushold: 0,
      // profileCarAge: "Entre 10 et 15 ans",
      // profileCarDistanceCarsharing: 0,
      // profileHeatPump: false,
      // profileACRoomNb: 0,
      // profileACDaysNb: 0,
      // profileShowerNumber: 1,
      // profileShowerTime: "5 à 10 minutes",
      // profileEatingVegetables: false,
      // profileEatingDairies: false,
      // profileEatingEggs: false,
      // profileEatingMeat: false,
    },
  });

  const buildFormLine = (question: any) => {
    return (
      <QuestionLine container direction="row" justifyContent="space-between">
        <QuestionText>
          {" "}
          {question.icon && <Icon name={question.icon} sx={{ mr: 1 }} />}
          {question.description}
        </QuestionText>
        {question.inputType === "free" && question.valueType === "number" && (
          <PersoFormNumberInput control={control} name={question.name} />
        )}
        {question.inputType === "list" && (
          <PersoFormInputList
            control={control}
            name={question.name}
            options={question.options}
            type={question.valueType}
          />
        )}
      </QuestionLine>
    );
  };

  const compare = (condition: any) => {
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

  const fulfillsConditions = (question: any) => {
    if (!question.conditions) {
      return true;
    }
    return question.conditions.every((condition: any) => compare(condition));
  };

  const buildFormSection = (section: string) => {
    return (
      <Grid container direction="column">
        {formValues
          .filter((question: any) => question.type === section)
          .filter((question: any) => fulfillsConditions(question))
          .map((value: any) => buildFormLine(value))}
      </Grid>
    );
  };

  const onSubmit = () => {
    console.log("submit", getValues());
  };

  return (
    <CustomContainer maxWidth="lg">
      <BackArrow />
      <Typography
        variant="h5"
        color="secondary"
        sx={{ textAlign: "center", mb: 4 }}
      >
        Personnaliser mon profil
      </Typography>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <AccordionLayout title="Général" titleIcon="player-pin">
          {buildFormSection(formSections.GENERAL)}
        </AccordionLayout>
        <AccordionLayout title="Déplacement" titleIcon="car">
          {buildFormSection(formSections.TRANSPORT)}
        </AccordionLayout>
        <AccordionLayout title="Logement" titleIcon="house">
          {buildFormSection(formSections.HOUSING)}
        </AccordionLayout>
        <AccordionLayout
          title="Habitudes dans le logement"
          titleIcon="microwave"
        >
          {buildFormSection(formSections.HABITS)}
        </AccordionLayout>
        <AccordionLayout title="Alimentation" titleIcon="food">
          {buildFormSection(formSections.FOOD)}
        </AccordionLayout>
        <AccordionLayout title="Numérique" titleIcon="computer">
          {buildFormSection(formSections.NUMERIC)}
        </AccordionLayout>
        <Button color="secondary" variant="contained" type="submit">
          Envoyer
        </Button>
      </form>
    </CustomContainer>
  );
}
