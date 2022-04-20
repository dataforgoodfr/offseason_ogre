import { useForm } from "react-hook-form";
import FormInput from "../common/components/FormInput";
import CustomButton from "../common/components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import TermsOfUse from "../common/components/TermsOfUse";

const Signin = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = ({ email }: any) => {
    navigate("/success", { state: { status: "signin", email } });
  };

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
};

export default Signin;
