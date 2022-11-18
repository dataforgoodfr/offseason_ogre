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
import { AccordionLayout } from "../common/AccordionLayout";
import {
  formBlockText,
  fulfillsConditions,
  getOrigin,
  isSectionValid,
} from "./utils/formValidation";
import { useAuth } from "../../auth/authProvider";
import { usePlay } from "../context/playContext";
import { useGameId } from "./hooks/useGameId";
import { isNotEmpty } from "./utils/choices";
import { BackArrowDialog, ValidationDialog } from "./common/Dialogs";
import axios from "axios";
import { useQuery } from "react-query";
import { IGame } from "../../../utils/types";
import { ErrorAlert } from "../../alert";

export { PersonalizationForm };

function PersonalizationForm() {
  const gameId = useGameId();
  const { profile, updateProfile } = usePlay();

  const query = useQuery(`/api/games/${gameId}`, () => {
    return axios.get<undefined, { data: { document: any } }>(
      `/api/games/${gameId}`
    );
  });
  const game = query?.data?.data?.document ?? [];

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

  const isFormValid = () =>
    Object.entries(formSections).every(([_, value]: [string, any]) =>
      isSectionValid(formValues, watch, value.name)
    );

  const canSave = (game: IGame) => game && game.status === "draft";

  const formatValidateTitle = (game: IGame) => {
    if (!canSave(game)) {
      return "La modification du formulaire a été bloquée par l'animateur car l'atelier va bientôt démarrer.";
    }
    if (!isFormValid()) {
      return "Le formulaire doit être complet pour pouvoir être validé.";
    }
    return "";
  };

  const onSubmit = () => {
    if (user && isFormValid()) {
      updateProfile({
        userId: user?.id,
        update: {
          ...getNonNullValues(),
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
          ...getNonNullValues(),
          profileStatus: "draft",
          origin: getOrigin(user?.id, gameId),
          personalizationName: "form",
        },
      });
    }
  };

  return (
    <CustomContainer maxWidth="lg">
      {(query.isLoading || (game && game?.status !== "draft")) && (
        <ErrorAlert message={formBlockText} />
      )}
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
              disabled={!canSave(game) || !isFormValid()}
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
            <Tooltip placement="left-start" title={formatValidateTitle(game)}>
              <span>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => setValidateDialogOpen(true)}
                  disabled={!canSave(game) || !isFormValid()}
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
