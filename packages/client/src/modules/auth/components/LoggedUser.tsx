import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import React from "react";
import { useQueryClient } from "react-query";

export { LoggedUser };

function LoggedUser() {
  const queryClient = useQueryClient();

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
        color="primary"
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
