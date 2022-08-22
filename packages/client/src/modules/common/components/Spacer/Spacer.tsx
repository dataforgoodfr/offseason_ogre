import { styled } from "@mui/material/styles";

export { Spacer };

const Spacer = styled("div")(({ theme }) => ({
  flexGrow: 1,
  flexShrink: 1,
}));
