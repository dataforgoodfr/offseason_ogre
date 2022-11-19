import { useEffect, useMemo, useState } from "react";
import { Button, Grid, Tooltip, Typography } from "@mui/material";
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
import {
  fulfillsConditions,
  getOrigin,
  isFormValid,
  isSectionValid,
  getNonNullValues,
} from "./utils/formValidation";
import { useAuth } from "../../auth/authProvider";
import { usePlay } from "../context/playContext";
import { useGameId } from "./hooks/useGameId";
import { BackArrowDialog, ValidationDialog } from "./common/Dialogs";
import { Accordion } from "../../common/components/Accordion";

export { PersonalizationForm };

function PersonalizationForm() {
  const gameId = useGameId();
  const { profile, updateProfile } = usePlay();

  const [validateDialogOpen, setValidateDialogOpen] = useState(false);
  const [rgpdCheckbox, setRgpdCheckbox] = useState(false);
  const [backArrowDialogOpen, setBackArrowDialogOpen] = useState(false);
  const backArrowDialogContent = {
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
    if (user && isFormValid(watch)) {
      updateProfile({
        userId: user?.id,
        update: {
          ...getNonNullValues(getValues()),
          profileStatus: "pendingValidation",
          origin: getOrigin(user?.id, gameId),
          personalizationName: "form",
        },
      });
    }
  };

  const saveDraft = () => {
    if (user) {
      updateProfile({
        userId: user?.id,
        update: {
          ...getNonNullValues(getValues()),
          profileStatus: "draft",
          origin: getOrigin(user?.id, gameId),
          personalizationName: "form",
        },
      });
    }
  };

  return (
    <CustomContainer maxWidth="lg">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction="row" justifyContent="space-between">
          {!isDirty && (
            <BackArrow path={`/play/games/${gameId}/personalize/choice`} />
          )}
          {isDirty && (
            <>
              <BackArrowWithValidation
                handleClickOpen={() => setBackArrowDialogOpen(true)}
              />
              <BackArrowDialog
                backArrowDialogOpen={backArrowDialogOpen}
                setBackArrowDialogOpen={setBackArrowDialogOpen}
                backArrowDialogContent={backArrowDialogContent}
                gameId={gameId}
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
          <Grid item display="flex">
            <Tooltip
              placement="left-start"
              title={
                !isFormValid(watch)
                  ? "Le formulaire doit être complet pour pouvoir être validé."
                  : ""
              }
            >
              <span>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => setValidateDialogOpen(true)}
                  disabled={!isFormValid(watch)}
                  sx={{
                    mr: "auto",
                    margin: "15px 0 35px 0",
                    padding: "10px 20px 10px 20px",
                  }}
                >
                  <Icon name="check-doubled" sx={{ mr: 1 }} />
                  Valider le formulaire
                </Button>
              </span>
            </Tooltip>
            <ValidationDialog
              validateDialogOpen={validateDialogOpen}
              setValidateDialogOpen={setValidateDialogOpen}
              rgpdCheckbox={rgpdCheckbox}
              setRgpdCheckbox={setRgpdCheckbox}
              onSubmit={onSubmit}
            />
          </Grid>
        </Grid>
        <Typography
          variant="h5"
          color="secondary"
          sx={{ textAlign: "center", mb: 4 }}
        >
          Personnaliser mon profil
        </Typography>
        <Accordion
          options={Object.entries(formSections).map(
            ([_, value]: [string, any]) => {
              const valid = isSectionValid(formValues, watch, value.name);
              return {
                key: value.name,
                header: (
                  <Typography alignItems="center" display="flex" variant="h6">
                    {valid && (
                      <Icon
                        className="validIcon"
                        name="check-circle"
                        sx={{ mr: 2 }}
                      />
                    )}
                    {value.titleIcon && (
                      <Icon name={value.titleIcon} sx={{ mr: 1 }} />
                    )}
                    {value.title}
                  </Typography>
                ),
                content: buildFormSection(value.name),
                valid: valid,
                themeVariation: "orange",
              };
            }
          )}
        />
      </form>
    </CustomContainer>
  );
}
