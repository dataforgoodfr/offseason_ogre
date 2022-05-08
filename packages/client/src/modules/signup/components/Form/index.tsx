import CustomButton from "../../../common/components/CustomButton";
import FormInput from "../../../common/components/FormInput";
import { useForm } from "react-hook-form";
import CheckboxWithText from "../CheckboxWithText";
import TermsOfUse from "../../../common/components/TermsOfUse";
import { NewUser } from "../../../users/services";
import { useMutation } from "react-query";
import axios from "axios";
import { ErrorAlert, SuccessAlert } from "../../../alert";

export default Form;

function Form() {
  const { control, getValues, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      email: "",
      policies: false,
    },
  });

  const mutation = useMutation<Response, { message: string }, NewUser>(
    (newUser) => {
      return axios.post("/api/users", newUser);
    }
  );

  const onValid = (formContent: any) =>
    mutation.mutate({ ...formContent, country: formContent.country.code });

  if (mutation.isSuccess) {
    return (
      <>
        <SuccessAlert />
        <SuccessMessage email={getValues("email")} />
      </>
    );
  }

  return (
    <>
      {mutation.isError && <ErrorAlert message={mutation.error.message} />}
      <UserForm />
    </>
  );

  function UserForm() {
    return (
      <form className="flex flex-col w-72" onSubmit={handleSubmit(onValid)}>
        <div className="flex flex-col justify-center items-center">
          <FormInput control={control} name="firstName" label="Prénom" />
          <FormInput control={control} name="lastName" label="Nom" />
          <FormInput control={control} name="country" label="Pays" />
          <FormInput control={control} name="email" label="Adresse mail" />
        </div>
        <TermsOfUse />
        <CheckboxWithText control={control} />
        <CustomButton
          type="submit"
          variant="contained"
          color="secondary"
          sx={{ margin: "auto", width: "161px" }}
        >
          Créer le compte
        </CustomButton>
      </form>
    );
  }
}

function SuccessMessage({ email }: { email: string }) {
  return (
    <div className="flex justify-center items-center w-120">
      <p className="text-white text-center">
        Votre compte a été créé, un mail contenant un lien de connexion a été
        envoyé sur l'adresse <span className="underline">{email}</span>.
        <br />
        Cliquez sur le lien de connexion pour accéder à l'application.
        <br />
        Vérifiez que le mail n'est pas arrivé dans votre boîte de Spam.
      </p>
    </div>
  );
}
