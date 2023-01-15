import { Box, Paper, Typography } from "@mui/material";
import { useAuth } from "../../auth/authProvider";
import { useTranslation } from "../../translations/useTranslation";
import { UsersDataGrid } from "../../users";

export { Players };

function Players(): JSX.Element {
  const { findRoleByName } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <Box alignItems="center" display="flex">
        <Typography variant="h3">{t("role.player_other")}</Typography>
      </Box>
      <Paper sx={{ mt: 2, p: 2 }}>
        <UsersDataGrid
          defaultFilterItems={[
            {
              columnField: "roleId",
              operatorValue: "is",
              value: findRoleByName("player")?.id,
            },
          ]}
        />
      </Paper>
    </>
  );
}
