import { useForm } from "react-hook-form";
import FormInput from "../common/components/FormInput";
import { Link } from "react-router-dom";
import TermsOfUse from "../common/components/TermsOfUse";
import { sendMagicLink } from "../users/services";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { ErrorAlert, SuccessAlert } from "../alert";
import { Button } from "@mui/material";

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

  const onSubmit = ({ email }: MagicForm) => mutation.mutate({ email });

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

  return (
    <>
      {mutation.isError && (
        <ErrorAlert
          message={mutation.error.response?.data.message || "Unknown error"}
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
