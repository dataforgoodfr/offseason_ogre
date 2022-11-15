import { Button, Grid, Typography } from "@mui/material";
import { CustomContainer } from "./styles/personalization";
import { BackArrow } from "./common/BackArrow";
import { AccordionLayout } from "../common/AccordionLayout";
import { QuestionLine, QuestionText } from "./styles/form";
import { useForm } from "react-hook-form";
import { PersoFormInputList, PersoFormNumberInput } from "./common/FormInputs";
import { formSections, formValues, PersoForm } from "./models/form";

export { PersonalizationForm };

function PersonalizationForm() {
  const { control, getValues, handleSubmit } = useForm<PersoForm, any>({
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
      profileShowerTime: "5-10 minutes",
      profileEatingVegetables: false,
      profileEatingDairies: false,
      profileEatingEggs: false,
      profileEatingMeat: false,
    },
  });

  const buildFormLine = (value: any) => {
    return (
      <QuestionLine container direction="row" justifyContent="space-between">
        <QuestionText>{value.description}</QuestionText>
        {value.inputType === "free" && value.valueType === "number" && (
          <PersoFormNumberInput control={control} name={value.name} />
        )}
        {value.inputType === "list" && (
          <PersoFormInputList
            control={control}
            name={value.name}
            options={value.options}
            type={value.valueType}
          />
        )}
      </QuestionLine>
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
        Personaliser mon profil
      </Typography>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <AccordionLayout title="Général" titleIcon="player-pin">
          <Grid container direction="column">
            {formValues
              .filter((values: any) => values.type === formSections.GENERAL)
              .map((value: any) => buildFormLine(value))}
          </Grid>
        </AccordionLayout>
        <AccordionLayout title="Déplacement" titleIcon="car">
          <Grid container direction="column">
            {formValues
              .filter((values: any) => values.type === formSections.TRANSPORT)
              .map((value: any) => buildFormLine(value))}
          </Grid>
        </AccordionLayout>
        <AccordionLayout title="Logement" titleIcon="house">
          <Grid container direction="column">
            {formValues
              .filter((values: any) => values.type === formSections.HOUSING)
              .map((value: any) => buildFormLine(value))}
          </Grid>
        </AccordionLayout>
        <AccordionLayout
          title="Habitudes dans le logement"
          titleIcon="microwave"
        >
          <Grid container direction="column">
            {formValues
              .filter((values: any) => values.type === formSections.HABITS)
              .map((value: any) => buildFormLine(value))}
          </Grid>
        </AccordionLayout>
        <AccordionLayout title="Alimentation" titleIcon="food">
          <Grid container direction="column">
            {formValues
              .filter((values: any) => values.type === formSections.FOOD)
              .map((value: any) => buildFormLine(value))}
          </Grid>
        </AccordionLayout>
        <AccordionLayout title="Numérique" titleIcon="computer">
          <Grid container direction="column">
            {formValues
              .filter((values: any) => values.type === formSections.NUMERIC)
              .map((value: any) => buildFormLine(value))}
          </Grid>
        </AccordionLayout>
        <Button color="secondary" variant="contained" type="submit">
          Envoyer
        </Button>
      </form>
    </CustomContainer>
  );
}
