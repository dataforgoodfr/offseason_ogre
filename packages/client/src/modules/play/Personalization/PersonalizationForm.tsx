import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Tooltip } from "@mui/material";
import { CustomContainer, Title } from "./styles/personalization";
import { BackArrow, BackArrowWithValidation } from "./common/BackArrow";
import { QuestionLine, QuestionText } from "./styles/form";
import { useForm } from "../../common/hooks/useForm";
import { PersoFormInputList, PersoFormNumberInput } from "./common/FormInputs";
import {
  formSections,
  formValues,
  getQuestionByName,
  PersoForm,
  persoFormInputs,
  Question,
} from "./models/form";
import { Icon } from "../../common/components/Icon";
import {
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
import { Typography } from "../../common/components/Typography";
import { Button } from "../../common/components/Button";

export { PersonalizationForm };

function PersonalizationForm() {
  const gameId = useGameId();
  const { t } = useTranslation(["common", "consumption-profiles"]);
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
    warningMessage: t("page.player.personalization.messsage.draft-unsaved"),
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
            {question.icon && <Icon name={question.icon} sx={{ mr: 1 }} />}
            {t(`consumption-profiles:form.question.${question.name}.title`)}
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
      return t("page.player.personalization.messsage.form-locked");
    }
    if (!isFormValid(watch)) {
      return t("page.player.personalization.messsage.form-incomplete");
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
        <ErrorAlert
          alertPosition="top"
          message={t("page.player.personalization.messsage.form-locked")}
        />
      )}
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            gap={1}
          >
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
              <Button disabled={!canSave(game)} onClick={() => saveDraft()}>
                <Icon name="settings" sx={{ mr: 1 }} />
                {t("cta.save-draft")}
              </Button>
            </Grid>
            <Grid item display="flex">
              <Tooltip placement="left-start" title={formatValidateTitle(game)}>
                <span>
                  <Button
                    onClick={() => setValidateDialogOpen(true)}
                    disabled={!canSave(game) || !isFormValid(watch)}
                  >
                    <Icon name="check-doubled" sx={{ mr: 1 }} />
                    {t("cta.validate-form")}
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

          <Title variant="h3">
            {t("page.player.personalization-form.title")}
          </Title>

          <FormStatusBanner />

          <Box>
            <Accordion
              options={Object.entries(formSections).map(([_, section]) => {
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
                      {t(
                        `consumption-profiles:form.section.${section.name}.title`
                      )}
                    </Typography>
                  ),
                  content: buildFormSection(section.name),
                  valid,
                  themeVariation: valid ? "accent-large" : "default-large",
                };
              })}
            />
          </Box>
        </Box>
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
