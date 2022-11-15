import { Grid, Typography } from "@mui/material";
import { CustomContainer } from "./styles/personalization";
import { BackArrow } from "./common/BackArrow";
import { QuestionLine, QuestionText } from "./styles/form";
import { useForm } from "react-hook-form";
import { PersoFormInputList, PersoFormNumberInput } from "./common/FormInputs";
import { formSections, formValues, PersoForm } from "./models/form";
import { Icon } from "../../common/components/Icon";
import { AccordionLayout } from "../common/AccordionLayout";
import { fulfillsConditions, isSectionValid } from "./utils/formValidation";

export { PersonalizationForm };

function PersonalizationForm() {
  const { control, getValues, handleSubmit, watch } = useForm<PersoForm, any>({
    defaultValues: {
      profileNumberAdults: 1,
      profileCarEnergy: "Essence",
      profileCarConsumption: 0,
      profileCarDistanceAlone: 0,
      profileCarDistanceHoushold: 0,
      profileCarAge: "Entre 10 et 15 ans",
      profileCarDistanceCarsharing: 0,
      profileHeatPump: false,
      profileACRoomNb: 0,
      profileACDaysNb: 0,
      profileShowerNumber: 1,
      profileShowerTime: "5 à 10 minutes",
      profileEatingVegetables: false,
      profileEatingDairies: false,
      profileEatingEggs: false,
      profileEatingMeat: false,
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

  const buildFormSection = (section: string) => {
    return (
      <Grid container direction="column">
        {formValues
          .filter((question: any) => question.type === section)
          .filter((question: any) => fulfillsConditions(watch, question))
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
        {/* <Button color="secondary" variant="contained" type="submit">
          Envoyer
        </Button> */}
      </form>
    </CustomContainer>
  );
}
