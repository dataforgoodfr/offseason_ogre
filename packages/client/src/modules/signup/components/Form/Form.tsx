import FormInput from "../../../common/components/FormInput";
import { useForm } from "../../../common/hooks/useForm";
import CheckboxWithText from "../CheckboxWithText";
import { NewUser } from "../../../users/services";
import { useMutation } from "react-query";
import { AxiosError } from "axios";
import { ErrorAlert, SuccessAlert } from "../../../alert";
import { Box, Button } from "@mui/material";
import { Typography } from "../../../common/components/Typography";
import { useTranslation } from "../../../translations/useTranslation";
import { Link } from "react-router-dom";
import { handleApiError, http } from "../../../../utils/request";

export default Form;

function Form() {
  const { t } = useTranslation();
  const { control, getValues, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      email: "",
      policies: false,
    },
  });

  const mutation = useMutation<
    Response,
    AxiosError<{ message: string }>,
    NewUser
  >((newUser) => {
    return http.post("/api/users/sign-up", newUser);
  });

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
      {mutation.isError && (
        <ErrorAlert
          message={handleApiError(mutation.error, {
            USER_ALREADY_EXISTS: () =>
              t("message.error.signup.USER_ALREADY_EXISTS"),
            default: () => t("message.error.global.UNEXPECTED"),
          })}
        />
      )}

      <Box color="#ffffff">
        <Box mb={4}>
          <Typography variant="h4" mb={1}>
            {t("page.signup.title")}
          </Typography>
        </Box>

        <Box mb={4}>
          <UserForm />
        </Box>

        <Box textAlign="center">
          <Typography>{t("page.signup.login-section.title")}</Typography>
          <Typography>
            <Link className="hover:underline" to="/magic-link">
              {t("page.signup.login-section.cta")}
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );

  function UserForm() {
    return (
      <form className="flex flex-col" onSubmit={handleSubmit(onValid)}>
        <div className="flex flex-col justify-center items-center">
          <FormInput
            control={control}
            name="firstName"
            label={t("form.field.first-name.label")}
          />
          <FormInput
            control={control}
            name="lastName"
            label={t("form.field.last-name.label")}
          />
          <FormInput
            control={control}
            name="country"
            label={t("form.field.country.label")}
          />
          <FormInput
            control={control}
            name="email"
            label={t("form.field.email.label")}
          />
        </div>
        <CheckboxWithText control={control} />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {t("cta.signup")}
        </Button>
      </form>
    );
  }
}

function SuccessMessage({ email }: { email: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center w-120 text-white text-center">
      {t("page.signup.account-created", {
        userEmail: email,
        returnObjects: true,
      }).map((html) => (
        <Typography
          key={html}
          dangerouslySetInnerHTML={{ __html: html }}
        ></Typography>
      ))}
    </div>
  );
}
