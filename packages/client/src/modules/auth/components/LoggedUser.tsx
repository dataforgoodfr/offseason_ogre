import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from "axios";
import React from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export { LoggedUser };

type muiColor =
  | "inherit"
  | "secondary"
  | "default"
  | "primary"
  | "error"
  | "info"
  | "success"
  | "warning"
  | undefined;

function LoggedUser({ color = "inherit" }: { color?: muiColor }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color={color}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ mt: 4 }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/play");
          }}
        >
          <PlayArrowIcon />
          <Typography sx={{ ml: 2 }}>Play</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/administration");
          }}
        >
          <AdminPanelSettingsIcon />
          <Typography sx={{ ml: 2 }}>Administration</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            axios.post("/api/users/logout").then(() => {
              queryClient.invalidateQueries("logged-user");
              handleClose();
            });
          }}
        >
          <LogoutIcon />
          <Typography sx={{ ml: 2 }}>Déconnexion</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}
