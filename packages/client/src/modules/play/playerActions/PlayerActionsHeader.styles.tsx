import { Box, Rating } from "@mui/material";
import { styled } from "@mui/material/styles";

export { DashboardItem, CustomRating, Spacer, HelpIconWrapper, MediaQuery };

const DashboardItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "> *": {
    display: "flex",
    alignItems: "center",
  },
  [theme.breakpoints.up("sm")]: {
    justifyContent: "start",
    "> *:nth-child(1)": {
      width: 300,
    },
  },
}));

const Spacer = styled("div")(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 1,
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const HelpIconWrapper = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "> *": {
      padding: "0 !important",
    },
  },
}));

const CustomRating = styled(Rating)(({ theme }) => ({
  flexWrap: "wrap",
}));

const MediaQuery = styled(Box)(({ theme }) => ({
  "> *": {
    "&.up-sm": {
      display: "flex",
    },
    "&.down-sm": {
      display: "none",
    },
  },
  [theme.breakpoints.down("sm")]: {
    "> *": {
      "&.up-sm": {
        display: "none",
      },
      "&.down-sm": {
        display: "flex",
      },
    },
  },
}));
