import { Typography as TypographyMui } from "@mui/material";
import { styled } from "@mui/material/styles";

export { Typography };

const Typography = styled(TypographyMui)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "&:is(h5)": {
      fontSize: 18,
    },
    "&:is(h6)": {
      fontSize: 16,
    },
    "&:is(p)": {
      marginRight: 0,
      fontSize: 14,
    },
  },
}));
