import { useForm } from "../common/hooks/useForm";
import FormInput from "../common/components/FormInput";
import { Link } from "react-router-dom";
import { sendMagicLink } from "../users/services";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { ErrorAlert, SuccessAlert } from "../alert";
import { Box, Button, useTheme } from "@mui/material";
import { handleApiError } from "../../utils/request";
import { Typography } from "../common/components/Typography";
import { useTranslation } from "../translations/useTranslation";

interface MagicForm {
  email: string;
}

function MagicLink() {
  const { t } = useTranslation();
  const { control, getValues, handleSubmit } = useForm<MagicForm, any>({
    defaultValues: {
      email: "",
    },
  });
  const mutation = useMutation<
    Response,
    AxiosError<{ message: string }>,
    { email: string }
  >(sendMagicLink);
  const theme = useTheme();

  if (mutation.isLoading) {
    return (
      <Typography color={theme.palette.grey[100]}>Envoi du mail...</Typography>
    );
  }

  if (mutation.isSuccess) {
    return (
      <>
        <SuccessAlert />
        <div className="flex justify-center items-center w-120">
          <p className="text-white text-center">
            Un mail contenant un lien de connexion a été envoyé à l'adresse{" "}
            <span className="underline">{getValues("email")}</span>.
            <br />
            Cliquez sur le lien fourni pour accéder à l'application.
            <br />
            Vérifiez que le mail n'est pas arrivé dans votre boîte de Spam.
          </p>
        </div>
      </>
    );
  }

  const onSubmit = ({ email }: MagicForm) => mutation.mutate({ email });

  return (
    <>
      {mutation.isError && (
        <ErrorAlert
          message={handleApiError(mutation.error, {
            USER_DOES_NOT_EXIST: () =>
              t("message.error.signup.USER_DOES_NOT_EXIST"),
            default: () => t("message.error.global.UNEXPECTED"),
          })}
        ></ErrorAlert>
      )}

      <Box display="flex" flexDirection="column" color="#ffffff">
        <Box mb={2}>
          <Typography variant="h4" mb={1}>
            {t("page.login.title")}
          </Typography>
          <Typography>{t("page.login.description")}</Typography>
        </Box>

        <Box mb={4}>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              control={control}
              name="email"
              label={t("form.field.email.label")}
            />
            <Button color="secondary" variant="contained" type="submit">
              {t("cta.send-magic-link")}
            </Button>
          </form>
        </Box>

        <Box mb={2} textAlign="center">
          <Typography>{t("page.login.signup-section.title")}</Typography>
          <Typography>
            <Link className="hover:underline" to="/signup">
              {t("page.login.signup-section.cta")}
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default MagicLink;
