import { Box, Button, Container, Paper, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

import { ErrorAlert, SuccessAlert } from "../../alert";
import FormInput from "../../common/components/FormInput";
import { User } from "../../users/types";
import { useAuth } from "../../auth/authProvider";
import { getCountryByCode } from "../../signup/components/SelectCountry";

export { Settings };

function Settings(): JSX.Element {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  let { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      country: getCountryByCode(user?.country) || "",
      email: user?.email || "",
    },
  });

  const mutateUser = useMutation<
    Response,
    AxiosError<{ message: string }>,
    User
  >(
    (updateData) => {
      return axios.put(`/api/users/${user!.id}`, updateData);
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("logged-user");
      },
    }
  );

  const onValid = (formContent: any) => {
    mutateUser.mutate({ ...formContent, country: formContent.country.code });
  };

  return (
    <>
      {mutateUser.isSuccess && <SuccessAlert />}
      {mutateUser.isError && (
        <ErrorAlert
          message={mutateUser.error.response?.data.message || "Unkown error"}
        />
      )}

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
  );
}
