import { Box, Container, ContainerProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export { VerificationContainer, DataGridBox };

const VerificationContainer = styled(
  (props: ContainerProps & { show: boolean }) => <Container {...props} />
)(({ theme, show }) => ({
  maxWidth: "none !important",
  position: "fixed",
  zIndex: 1250,
  top: 0,
  left: 0,
  paddingTop: "100px",
  paddingLeft: "30px",
  width: "100%",
  height: "100%",
  backdropFilter: "blur(10px)",
  display: `${show ? "block" : "none"}`,
}));

const DataGridBox = styled(Box)(({ theme }) => ({
  height: 500,
  width: "100%",
  "& .not-credible-cell": {
    backgroundColor: theme.palette.primary.contrastText,
  },
}));
