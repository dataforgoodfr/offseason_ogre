import { Button, Container, Grid, Typography } from "@mui/material";
import { CustomContainer } from "./styles/personalization";
import { BackArrow } from "./common/BackArrow";
import { QuestionLine, QuestionText } from "./styles/form";
import { useForm } from "react-hook-form";
import { PersoFormInputList, PersoFormNumberInput } from "./common/FormInputs";
import { formSections, formValues, PersoForm } from "./models/form";
import { Icon } from "../../common/components/Icon";
import { AccordionLayout } from "../common/AccordionLayout";
import { fulfillsConditions, isSectionValid } from "./utils/formValidation";
import axios from "axios";
import { useQueryClient, useMutation } from "react-query";
import { SuccessAlert, ErrorAlert } from "../../alert";
import { useGameId } from "./hooks/useGameId";
import { useAuth } from "../../auth/authProvider";

export { PersonalizationForm };

function PersonalizationForm() {
  const { control, getValues, handleSubmit, watch } = useForm<PersoForm, any>({
    defaultValues: {},
  });

  const queryClient = useQueryClient();
  const gameId = useGameId();
  const { user } = useAuth();

  const mutation = useMutation<Response, { message: string }>(
    () => {
      return axios.post(
        `/api/games/${gameId}/personalize/${user?.id}`,
        getValues()
      );
    },
    {
      onSuccess: () => console.log("yay"),
    }
  );

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

  const saveDraft = () => {
    mutation.mutate();
  };

  return (
    <CustomContainer maxWidth="lg">
      {mutation.isSuccess && <SuccessAlert />}
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
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
        {/* <Button color="secondary" variant="contained" type="submit">
          Envoyer
        </Button> */}
      </form>
    </CustomContainer>
  );
}
