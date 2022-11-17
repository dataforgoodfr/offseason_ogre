import { useEffect, useMemo, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { CustomContainer } from "./styles/personalization";
import { BackArrow, BackArrowWithValidation } from "./common/BackArrow";
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
import { useGameId } from "./hooks/useGameId";
import { isNotEmpty } from "./utils/choices";
import { useNavigate } from "react-router-dom";
import { Dialog } from "../../common/components/Dialog";

export { PersonalizationForm };

function PersonalizationForm() {
  const navigate = useNavigate();
  const gameId = useGameId();
  const { profile, updateProfile } = usePlay();

  const [open, setOpen] = useState(false);
  const dialogContent = {
    warningMessage: `Il semble que vous n’ayez pas sauvegardé votre formulaire. Etes-vous sur de vouloir revenir en arrière ? Vous perdrez l’ensemble de vos réponses aux questions du formulaire si vous validez le retour`,
  };

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<PersoForm, Record<string, any>>({
    shouldUnregister: false,
    defaultValues: useMemo(() => {
      return profile.personalization;
    }, [profile]),
  });

  useEffect(() => {
    const values = Object.entries(profile?.personalization || {})
      .filter(([key, _]: [string, any]) => {
        return persoFormInputs.includes(key);
      })
      .map(([key, val]: [string, any]) => {
        return { [key]: val === null ? undefined : val };
      });
    reset(Object.assign({}, ...values));
  }, [profile, reset]);

  const { user } = useAuth();

  const getNonNullValues = () => {
    return Object.fromEntries(
      Object.entries(getValues()).filter(([_, value]: [string, any]) =>
        isNotEmpty(value)
      )
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

  const buildFormLine = (question: Question, display: boolean) => {
    return (
      <QuestionLine
        container
        sx={{ display: display ? "flex" : "none" }}
        direction="row"
        justifyContent="space-between"
      >
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
          // https://github.com/react-hook-form/react-hook-form/issues/1990
          .map((question: Question) =>
            buildFormLine(question, fulfillsConditions(watch, question))
          )}
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
          origin: `player_${user?.id}_${gameId}`,
          personalizationName: "form",
        },
      });
    }
  };

  return (
    <CustomContainer maxWidth="lg">
      <Grid container direction="row" justifyContent="space-between">
        {!isDirty && (
          <BackArrow path={`/play/games/${gameId}/personalize/choice`} />
        )}
        {isDirty && (
          <>
            <BackArrowWithValidation handleClickOpen={() => setOpen(true)} />
            <Dialog
              open={open}
              handleClose={() => setOpen(false)}
              content={dialogContent.warningMessage}
              actions={
                <>
                  <Button
                    color="secondary"
                    variant="contained"
                    sx={{ border: 1, borderColor: "secondary" }}
                    onClick={() =>
                      navigate(`/play/games/${gameId}/personalize/choice`)
                    }
                  >
                    Oui
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    sx={{ border: 1, borderColor: "secondary", mt: 1 }}
                    onClick={() => setOpen(false)}
                  >
                    Non
                  </Button>
                </>
              }
            />
          </>
        )}

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
        {Object.entries(formSections).map(([_, value]: [string, any]) => (
          <AccordionLayout
            valid={isSectionValid(formValues, watch, value.name)}
            title={value.title}
            titleIcon={value.titleIcon}
          >
            {buildFormSection(value.name)}
          </AccordionLayout>
        ))}
      </form>
    </CustomContainer>
  );
}
