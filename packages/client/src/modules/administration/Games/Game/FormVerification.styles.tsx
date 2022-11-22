import { Container, ContainerProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export { VerificationContainer };

const VerificationContainer = styled(
  (props: ContainerProps & { show: boolean }) => <Container {...props} />
)(({ theme, show }) => ({
  maxWidth: "none !important",
  position: "fixed",
  zIndex: 9999,
  top: 0,
  left: 0,
  paddingTop: "100px",
  paddingLeft: "30px",
  width: "100%",
  height: "100%",
  backdropFilter: "blur(10px)",
  display: `${show ? "block" : "none"}`,
}));
