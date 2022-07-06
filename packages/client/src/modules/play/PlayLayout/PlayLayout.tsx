import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { LoggedUser } from "../../auth";
import { useAuth } from "../../auth/authProvider";

export { PlayLayout };

function PlayLayout() {
  const { user } = useAuth();

  return (
    <Box display="flex">
      <AppBar color="primary" position="fixed">
        <Toolbar>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {user?.firstName || user?.lastName
              ? `${user.firstName} ${user.lastName} | `
              : ""}{" "}
            {"Play"}
          </Typography>
          <LoggedUser />
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          bgcolor: "#577590",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: "auto" }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
