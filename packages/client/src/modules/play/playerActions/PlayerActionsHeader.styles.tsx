import { Rating } from "@mui/material";
import { styled } from "@mui/material/styles";

export { CustomRating, Spacer, HelpIconWrapper };

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
