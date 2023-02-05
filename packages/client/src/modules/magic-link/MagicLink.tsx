import { useForm } from "react-hook-form";
import FormInput from "../common/components/FormInput";
import { Link } from "react-router-dom";
import TermsOfUse from "../common/components/TermsOfUse";
import { sendMagicLink } from "../users/services";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { ErrorAlert, SuccessAlert } from "../alert";
import { Button, Typography, useTheme } from "@mui/material";
import { handleApiError } from "../../utils/request";
import { t } from "../translations";

interface MagicForm {
  email: string;
}

function MagicLink() {
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
      <div className="flex flex-col">
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <FormInput control={control} name="email" label="Adresse mail" />
          <Button color="secondary" variant="contained" type="submit">
            Envoyez moi un lien de connexion
          </Button>
        </form>
        <Link
          className="text-white self-center m-4 hover:text-white hover:underline"
          to="/signup"
        >
          Créer un compte
        </Link>
        <TermsOfUse />
      </div>
    </>
  );
}

export default MagicLink;
