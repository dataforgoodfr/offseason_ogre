import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import { Link, Navigate, Outlet, useMatch } from "react-router-dom";
import GamesIcon from "@mui/icons-material/Games";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
  useTheme,
} from "@mui/material";
import React, { Fragment } from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { LoggedUser } from "../auth";
import { useAuth } from "../auth/authProvider";
import InvertColorsIcon from "@mui/icons-material/InvertColors";

const drawerWidth: number = 240;

export { Layout };

function Layout() {
  const { user } = useAuth();
  const theme = useTheme();
  const isGameAdministraionRoute = useMatch(`administration/games/:gameId/*`);

  if (!user?.isTeacher) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <LayoutAppBar>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          {isGameAdministraionRoute ? renderBackButton() : <></>}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Administration
          </Typography>
          <LoggedUser />
        </Toolbar>
      </LayoutAppBar>
      <LayoutDrawer>
        <>
          <Link to="/">
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InvertColorsIcon
                color="primary"
                style={{
                  fontSize: theme.spacing(5),
                }}
              />
              <Typography color="primary" variant="h4">
                Ogre
              </Typography>
            </Toolbar>
          </Link>
          <Divider />
          <Navigation />
        </>
      </LayoutDrawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
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

function renderBackButton(): JSX.Element {
  return (
    <>
      <Button component={Link} to="/administration/games" sx={{ mr: 2 }}>
        <ArrowBackIosNewIcon sx={{ height: "1rem" }} /> Retour
      </Button>
      <Divider
        orientation="vertical"
        color="secondary"
        sx={{ height: (theme) => theme.spacing(4), mr: 3 }}
      />
    </>
  );
}

function LayoutDrawer({ children }: { children: JSX.Element }) {
  return (
    <Drawer
      variant="permanent"
      open={true}
      sx={{
        "& .MuiDrawer-paper": {
          position: "relative",
          whiteSpace: "nowrap",
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      {children}
    </Drawer>
  );
}

function LayoutAppBar({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <AppBar
      color="secondary"
      position="absolute"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
      }}
    >
      {children}
    </AppBar>
  );
}

function Navigation() {
  return (
    <Fragment>
      <List
        component="nav"
        subheader={
          <ListSubheader component="div" id="game-list-items-subheader">
            Ateliers
          </ListSubheader>
        }
      >
        <GameListItems />
      </List>
      <List
        component="nav"
        subheader={
          <ListSubheader component="div" id="admin-list-items-subheader">
            Administration
          </ListSubheader>
        }
      >
        <AdminListItems />
      </List>
    </Fragment>
  );
}

function GameListItems() {
  return (
    <Fragment>
      {[
        {
          Icon: GamesIcon,
          label: "Gestion des ateliers",
          to: "/administration/games",
        },
      ].map(RenderListItem)}
    </Fragment>
  );
}

function AdminListItems() {
  return (
    <Fragment>
      {[
        { Icon: PersonIcon, label: "Joueurs", to: "/administration/players" },
        {
          Icon: SchoolIcon,
          label: "Animateurs",
          to: "/administration/teachers",
        },
        {
          Icon: SettingsIcon,
          label: "Gérer mon profil",
          to: "/administration/settings",
        },
      ].map(RenderListItem)}
    </Fragment>
  );
}

function RenderListItem({
  Icon,
  label,
  to,
}: {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  label: string;
  to: string;
}) {
  const match = useMatch(`${to}/*`);
  return (
    <Link to={to} key={to}>
      <ListItemButton selected={match !== null}>
        <ListItemIcon>
          <Icon color="primary" />
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            color: "primary",
          }}
        />
      </ListItemButton>
    </Link>
  );
}
