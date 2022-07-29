import { Box, Grid, Button, useTheme } from "@mui/material";
export { ValidateActions };

function ValidateActions() {
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      color="actionValidation"
      sx={{
        mt: 2,
        width: "200px",
        height: "3rem",
      }}
    >
      {" "}
      Terminer le tour
    </Button>
  );
}
