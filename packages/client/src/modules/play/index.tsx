import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { LoggedUser } from "../auth";

export { MyGames };

function MyGames() {
  const children = <>Hello MyGames</>;
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar color="primary" position="absolute">
        <Toolbar>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Play
          </Typography>
          <LoggedUser />
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
}
