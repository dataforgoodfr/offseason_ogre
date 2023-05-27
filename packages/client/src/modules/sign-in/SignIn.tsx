import { CircularProgress, useTheme } from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { http } from "../../utils/request";
import { useQueryParams } from "../common/hooks/useQueryParams";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../alert/AlertProvider";
import { useTranslation } from "../translations";

export default SignIn;

function SignIn() {
  const params = useQueryParams<"token">();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueAlert } = useAlerts();
  const { t } = useTranslation();

  const { refetch: signIn } = useQuery(
    "/api/users/sign-in",
    () => {
      return http.get(`/api/users/sign-in?token=${params.token}`);
    },
    {
      enabled: false,
      onSuccess: async () => {
        await queryClient.invalidateQueries("logged-user");
        enqueueAlert({
          severity: "success",
          message: t("message.success.sign-in.user-authenticated"),
          alertPosition: "top",
        });
        navigate("/");
      },
      onError: (err) => {
        enqueueAlert({
          severity: "error",
          message: t("message.error.global.UNEXPECTED"),
          alertPosition: "top",
        });
        navigate("/");
      },
    }
  );

  useEffect(() => {
    const doSignIn = async () => {
      await signIn();
    };
    doSignIn();
  }, [signIn]);

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: theme.palette.primary.main }}
    >
      <CircularProgress color="secondary" sx={{ margin: "auto" }} />
    </div>
  );
}
