import {  Box, Container, Toolbar, } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PlayLayoutHeader } from "./PlayLayoutHeader";

export { PlayLayout };

function PlayLayout() {

  return (
    <Box display="flex">
      <PlayLayoutHeader />
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
