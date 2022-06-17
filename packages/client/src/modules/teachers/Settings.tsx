import { Box, Button, Container, Paper, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { Layout } from "../administration/Layout";
import { SuccessAlert } from "../alert";
import FormInput from "../common/components/FormInput";
import { NewUser } from "../users/services";

export { Settings };

function Settings(): JSX.Element {
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
    return axios.post("/api/users/sign-up", newUser);
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
    <Layout>
      <>
        <Box alignItems="center" display="flex">
          <Typography variant="h3">Mes informations générales</Typography>
        </Box>

        <Paper sx={{ mt: 2, p: 2, pt: 4, pb: 4 }}>
          <form className="flex flex-col" onSubmit={handleSubmit(onValid)}>
            <Container
              sx={{ display: "flex", justifyContent: "space-between" }}
              className="mt-2 mb-2"
            >
              <FormInput
                control={control}
                name="firstName"
                label="Prénom"
                themeVariant="light"
                variant="standard"
              />
              <FormInput
                control={control}
                name="lastName"
                label="Nom"
                themeVariant="light"
                variant="standard"
              />
              <FormInput
                control={control}
                name="email"
                label="Adresse mail"
                themeVariant="light"
                variant="standard"
              />
            </Container>
            <Container
              sx={{ display: "flex", alignItems: "end" }}
              className="mt-4 mb-2"
            >
              <FormInput
                control={control}
                name="country"
                label="Pays"
                themeVariant="light"
                variant="standard"
              />
            </Container>
            <Container
              sx={{ display: "flex", justifyContent: "end" }}
              className="mt-4 mb-2"
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: "161px" }}
                startIcon={<SaveIcon />}
              >
                Sauvegarder
              </Button>
            </Container>
          </form>
        </Paper>
      </>
    </Layout>
  );
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
