import { Box, Paper, Typography } from "@mui/material";
import { UsersDataGrid } from "../../users";

export { Teachers };

function Teachers(): JSX.Element {
  return (
    <>
      <Box alignItems="center" display="flex">
        <Typography variant="h3">Animateurs</Typography>
      </Box>
      <Paper sx={{ mt: 2, p: 2 }}>
        <UsersDataGrid
          defaultFilterItems={[
            { columnField: "isTeacher", operatorValue: "is", value: "true" },
          ]}
        />
      </Paper>
    </>
  );
}
