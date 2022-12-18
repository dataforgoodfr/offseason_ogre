import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedUser } from "../../auth";
import { useAuth } from "../../auth/authProvider";

export { PlayLayoutHeader };

function PlayLayoutHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName: string = useMemo(() => {
    const nameChunks = [];
    if (user?.firstName) nameChunks.push(user?.firstName);
    if (user?.lastName) nameChunks.push(user?.lastName);

    return nameChunks.join(" ") || "";
  }, [user]);

  return (
    <AppBar color="primary" position="fixed">
      <Toolbar className="flex justify-between">
        <img
          className="cursor-pointer	"
          style={{ height: 32, padding: 1 }}
          src="/logoWithName.png"
          alt="Logo OGRE with name"
          onClick={() => navigate("/play")}
        />
        <Box className="flex items-center">
          <Typography
            className="grow "
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
          >
            {userName}
          </Typography>
          <LoggedUser />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
