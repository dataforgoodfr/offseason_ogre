import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link, Navigate, useMatch } from "react-router-dom";
import GamesIcon from "@mui/icons-material/Games";
import {
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

const drawerWidth: number = 240;

export { Layout };

function Layout({
  children,
  renderLeftTool = () => <></>,
}: {
  children: JSX.Element;
  renderLeftTool?: () => JSX.Element;
}) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { user } = useAuth();

  if (!user?.isTeacher) {
    return <Navigate to="/" />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <LayoutAppBar open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {renderLeftTool()}
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
      <LayoutDrawer open={open}>
        <>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems />
          </List>
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
          {children}
        </Container>
      </Box>
    </Box>
  );
}

function LayoutDrawer({
  children,
  open,
}: {
  children: JSX.Element;
  open: boolean;
}) {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          position: "relative",
          whiteSpace: "nowrap",
          width: drawerWidth,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          boxSizing: "border-box",
          ...(!open && {
            overflowX: "hidden",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            width: (theme) => theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
              width: (theme) => theme.spacing(9),
            },
          }),
        },
      }}
    >
      {children}
    </Drawer>
  );
}

function LayoutAppBar({
  children,
  open,
}: {
  children: JSX.Element;
  open: boolean;
}): JSX.Element {
  return (
    <AppBar
      color="secondary"
      position="absolute"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) =>
          theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(open && {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }),
      }}
    >
      {children}
    </AppBar>
  );
}

function MainListItems() {
  return (
    <Fragment>
      {[
        { Icon: GamesIcon, label: "Ateliers", to: "/administration/games" },
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
