import { styled } from "@mui/material/styles";

export { Host };

const Host = styled("span")(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 1,
  cursor: "pointer",
  ".copy-to-clipboard__icon": {
    visibility: "hidden",
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  "&:hover": {
    ".copy-to-clipboard__icon": {
      visibility: "visible",
    },
  },
}));
