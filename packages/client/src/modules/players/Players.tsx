import { Box, Paper, Typography } from "@mui/material";
import { UsersDataGrid } from "../users";

export { Players };

function Players(): JSX.Element {
  return (
    <>
      <Box alignItems="center" display="flex">
        <Typography variant="h3">Joueurs</Typography>
      </Box>
      <Paper sx={{ mt: 2, p: 2 }}>
        <UsersDataGrid
          defaultFilterItems={[
            { columnField: "isTeacher", operatorValue: "is", value: "false" },
          ]}
        />
      </Paper>
    </>
  );
}
