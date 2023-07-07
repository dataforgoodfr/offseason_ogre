import { Typography as TypographyMui } from "@mui/material";
import { styled } from "@mui/material/styles";

export { Typography };

const Typography = styled(TypographyMui)(({ theme }) => ({
  "&:is(h1)": {
    letterSpacing: "-0.5px",
  },
  "&:is(h2)": {
    letterSpacing: "-0.5px",
  },
  "&:is(h3)": {
    letterSpacing: "-0.5px",
  },
  "&:is(h4)": {
    fontSize: 22,
    letterSpacing: "-0.5px",
  },
  "&:is(h5)": {
    fontSize: 18,
  },
  [theme.breakpoints.down("sm")]: {
    "&:is(h5)": {
      fontSize: 18,
    },
    "&:is(h6)": {
      fontSize: 16,
    },
    "&:is(p), &:is(span)": {
      marginRight: 0,
      fontSize: 14,
    },
  },
}));
