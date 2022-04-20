import CustomButton from "../../../common/components/CustomButton";
import FormInput from "../../../common/components/FormInput";
import { useForm } from "react-hook-form";
import CheckboxWithText from "../CheckboxWithText";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TermsOfUse from "../../../common/components/TermsOfUse";

const inputTheme = createTheme({
  width: "218px",
});

const buttonTheme = createTheme({
  width: "161px",
});

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

  const onSubmit = ({ email }: any) => {
    navigate("/success", { state: { status: "signup", email } });
  };
  return (
    <form className="flex flex-col w-72" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-center items-center">
        <ThemeProvider theme={inputTheme}>
          <FormInput control={control} name="firstName" label="Nom" />
          <FormInput control={control} name="lastName" label="Prénom" />
          <FormInput control={control} name="country" label="Pays" />
          <FormInput control={control} name="email" label="Adresse mail" />
        </ThemeProvider>
      </div>
      <TermsOfUse />
      <CheckboxWithText control={control} />
      <ThemeProvider theme={buttonTheme}>
        <CustomButton type="submit" variant="contained">
          Créer le compte
        </CustomButton>
      </ThemeProvider>
    </form>
  );
};

export default Form;
