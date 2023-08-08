import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authProvider";
import { useTranslation } from "../../translations";
import { Typography } from "../../common/components/Typography";
import { Icon } from "../../common/components/Icon";

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
  const { t } = useTranslation();
  const { setToken } = useAuth();

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
        <Icon name="user-account" />
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
          <Icon name="play" />
          <Typography sx={{ ml: 2 }}>{t("cta.go-to-games-list")}</Typography>
        </MenuItem>
        <AdministrationMenuItem handleClose={handleClose} />
        <MenuItem
          onClick={() => {
            setToken(null);
            queryClient.invalidateQueries("logged-user");
            handleClose();
          }}
        >
          <Icon name="logout" />
          <Typography sx={{ ml: 2 }}>{t("cta.logout")}</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

function AdministrationMenuItem({ handleClose }: { handleClose: () => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { permissions } = useAuth();

  if (!permissions.canAccessAdminPanel) {
    return <></>;
  }
  return (
    <MenuItem
      onClick={() => {
        handleClose();
        navigate("/administration");
      }}
    >
      <Icon name="admin-panel" />
      <Typography sx={{ ml: 2 }}>{t("cta.go-to-admin-home")}</Typography>
    </MenuItem>
  );
}
