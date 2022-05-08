import { useForm } from "react-hook-form";
import FormInput from "../common/components/FormInput";
import CustomButton from "../common/components/CustomButton";
import { Link } from "react-router-dom";
import TermsOfUse from "../common/components/TermsOfUse";
import { sendMagicLink } from "../users/services";
import { useState } from "react";

interface MagicForm {
  email: string;
}

function MagicLink() {
  const [hasMagicLinkBeenSent, setHasMagicLinkBeenSent] = useState(false);

  const { control, getValues, handleSubmit } = useForm<MagicForm, any>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = ({ email }: MagicForm) =>
    sendMagicLink({ email }).then(() => setHasMagicLinkBeenSent(true));

  if (hasMagicLinkBeenSent) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <FormInput control={control} name="email" label="Adresse mail" />
        <CustomButton type="submit" variant="contained" color="secondary">
          Envoyez moi un lien de connexion
        </CustomButton>
      </form>
      <Link
        className="text-white self-center m-4 hover:text-white hover:underline"
        to="/signup"
      >
        Créer un compte
      </Link>
      <TermsOfUse />
    </div>
  );
}

export default MagicLink;
