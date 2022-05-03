import CustomButton from "../../../common/components/CustomButton";
import FormInput from "../../../common/components/FormInput";
import { useForm } from "react-hook-form";
import CheckboxWithText from "../CheckboxWithText";
import TermsOfUse from "../../../common/components/TermsOfUse";
import { createUser } from "../../../users/services";
import { useState } from "react";

const Form = () => {
  const [hasUserBeenCreated, setHasUserBeenCreated] = useState(false);
  const { control, getValues, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      email: "",
      policies: false,
    },
  });

  const onSubmit = (formContent: any) => {
    const newUser = { ...formContent, country: formContent.country.code };
    createUser({ newUser }).then(() => setHasUserBeenCreated(true));
  };

  if (hasUserBeenCreated) {
    return (
      <div className="flex justify-center items-center w-120">
        <p className="text-white text-center">
          Votre compte a été créé, un mail contenant un lien de connexion a été
          envoyé sur l'adresse{" "}
          <span className="underline">{getValues("email")}</span>.
          <br />
          Cliquez sur le lien de connexion pour accéder à l'application.
          <br />
          Vérifiez que le mail n'est pas arrivé dans votre boîte de Spam.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col w-72" onSubmit={handleSubmit(onSubmit)}>
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
};

export default Form;
