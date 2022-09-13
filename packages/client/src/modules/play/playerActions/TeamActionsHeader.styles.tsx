import { styled } from "@mui/material/styles";

export { HelpIconWrapper };

const HelpIconWrapper = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "> *": {
      padding: "0 !important",
    },
  },
}));
