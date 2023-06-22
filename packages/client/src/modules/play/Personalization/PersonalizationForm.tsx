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
  getQuestionByName,
  PersoForm,
  persoFormInputs,
  Question,
} from "./models/form";
import { Icon, IconName } from "../../common/components/Icon";
import {
  formBlockText,
  fulfillsConditionsForm,
  getOrigin,
  isFormValid,
  isSectionValid,
  fillWithNull,
} from "./utils/formValidation";
import { useAuth } from "../../auth/authProvider";
import { usePlay } from "../context/playContext";
import { useGameId } from "./hooks/useGameId";
import { BackArrowDialog, ValidationDialog } from "./common/Dialogs";
import { useQuery } from "react-query";
import { IGame } from "../../../utils/types";
import { ErrorAlert, SuccessAlert } from "../../alert";
import { Accordion } from "../../common/components/Accordion";
import { FormStatusBanner } from "./common/FormStatusBanner";
import { useTranslation } from "../../translations/useTranslation";
import { http } from "../../../utils/request";
import { useCurrentPlayer } from "../context/hooks/player";

export { PersonalizationForm };

function PersonalizationForm() {
  const gameId = useGameId();
  const { t } = useTranslation();
  const { updateProfile } = usePlay();
  const { profile } = useCurrentPlayer();
  const [formSaveStatus, setFormSaveStatus] = useState<
    "draft-saved" | "form-validated" | "error" | null
  >(null);

  const query = useQuery(`/api/games/${gameId}`, () => {
    return http.get<undefined, { data: { document: any } }>(
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

  const shouldShowSaveSuccessAlert = useMemo(() => {
    return (
      formSaveStatus &&
      ["draft-saved", "form-validated"].includes(formSaveStatus)
    );
  }, [formSaveStatus]);
  const shouldShowSaveErrorAlert = useMemo(() => {
    return formSaveStatus && ["error"].includes(formSaveStatus);
  }, [formSaveStatus]);

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
      const consumption =
        profile?.personalization?.heatingConsumption ||
        getQuestionByName("heatingConsumption")?.defaultValue;
      const invoice =
        profile?.personalization?.heatingInvoice ||
        getQuestionByName("heatingInvoice")?.defaultValue;
      return {
        ...(profile?.personalization || {}),
        heatingConsumption: consumption,
        heatingInvoice: invoice,
      } as PersoForm;
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

  const buildFormLine = (key: string, question: Question, display: boolean) => {
    return (
      <QuestionLine key={key} sx={{ display: display ? "grid" : "none" }}>
        <div className="question-line__text-wrapper">
          <QuestionText>
            {question.icon && (
              <Icon name={question.icon as IconName} sx={{ mr: 1 }} />
            )}
            {question.description}
          </QuestionText>
        </div>
        <div className="question-line__input-wrapper">
          {getComponentType(question)}
        </div>
      </QuestionLine>
    );
  };

  const buildFormSection = (questionType: string) => {
    return (
      <Grid container direction="column">
        {formValues
          .filter((question: Question) => question.type === questionType)
          // https://github.com/react-hook-form/react-hook-form/issues/1990
          .map((question: Question) =>
            buildFormLine(
              question.name,
              question,
              fulfillsConditionsForm(watch, question)
            )
          )}
      </Grid>
    );
  };

  const canSave = (game: IGame) => game && game.status === "draft";

  const formatValidateTitle = (game: IGame) => {
    if (!canSave(game)) {
      return formBlockText;
    }
    if (!isFormValid(watch)) {
      return "Le formulaire doit être complet pour pouvoir être validé.";
    }
    return "";
  };

  const onSubmit = () => {
    if (user && isFormValid(watch)) {
      updateProfile(
        {
          userId: user?.id,
          update: {
            ...fillWithNull(getValues()),
            profileStatus: "pendingValidation",
            origin: getOrigin(user?.id, gameId),
            personalizationName: "form",
          },
        },
        (res) => setFormSaveStatus(res?.success ? "form-validated" : "error")
      );
    }
  };

  const saveDraft = () => {
    if (user) {
      updateProfile(
        {
          userId: user?.id,
          update: {
            ...fillWithNull(getValues()),
            profileStatus: "draft",
            origin: getOrigin(user?.id, gameId),
            personalizationName: "form",
          },
        },
        (res) => setFormSaveStatus(res?.success ? "draft-saved" : "error")
      );
    }
  };

  return (
    <CustomContainer maxWidth="lg">
      {game?.status && game.status !== "draft" && (
        <ErrorAlert alertPosition="top" message={formBlockText} />
      )}
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <FormStatusBanner />
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
              disabled={!canSave(game)}
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
                  disabled={!canSave(game) || !isFormValid(watch)}
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
            ([_, section]: [string, any]) => {
              const valid = isSectionValid(formValues, watch, section.name);
              return {
                key: section.name,
                header: (
                  <Typography alignItems="center" display="flex" variant="h6">
                    {valid && (
                      <Icon
                        className="validIcon"
                        name="check-circle"
                        sx={{ mr: 2 }}
                      />
                    )}
                    {section.titleIcon && (
                      <Icon name={section.titleIcon} sx={{ mr: 1 }} />
                    )}
                    {section.title}
                  </Typography>
                ),
                content: buildFormSection(section.name),
                valid,
                themeVariation: valid ? "accent-large" : "default-large",
              };
            }
          )}
        />
      </form>

      {shouldShowSaveSuccessAlert && (
        <SuccessAlert
          message={
            formSaveStatus === "form-validated"
              ? t("message.success.form-validated")
              : t("message.success.draft-saved")
          }
          onClose={() => {
            setFormSaveStatus(null);
          }}
        />
      )}
      {shouldShowSaveErrorAlert && (
        <ErrorAlert message={t("message.error.global.UNEXPECTED")} />
      )}
    </CustomContainer>
  );
}
