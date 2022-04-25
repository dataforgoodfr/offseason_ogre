import CustomButton from "../../../common/components/CustomButton";
import FormInput from "../../../common/components/FormInput";
import { useForm } from "react-hook-form";
import CheckboxWithText from "../CheckboxWithText";
import { useNavigate } from "react-router-dom";
import TermsOfUse from "../../../common/components/TermsOfUse";
import { User } from "../../../users/types";
import { createUser } from "../../../users/services";

const Form = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      email: "",
      policies: false,
    },
  });

  const onSubmit = (formContent: any) => {
    console.log("formContent", formContent);
    const newUser = { ...formContent, country: formContent.country.code };
    createUser({ newUser }).then((user: User) => {
      navigate("/success", { state: { status: "signup", email: user.email } });
    });
  };
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
