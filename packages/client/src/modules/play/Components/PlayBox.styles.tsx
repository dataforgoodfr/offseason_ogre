import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getStyledProps } from "../../../utils/theme";

export { HeaderMask, HeaderSection, StyledBox };

const HeaderSection = styled(
  Box,
  getStyledProps("headerSticky")
)<{ headerSticky: boolean }>(({ theme, headerSticky }) => {
  if (headerSticky) {
    return {
      position: "sticky",
      // TODO: parametrize spacing based on page padding.
      top: `calc(${theme.variables.headerHeight.sm}px + ${theme.spacing(2)})`,
      zIndex: 1,
      [theme.breakpoints.up("sm")]: {
        // TODO: parametrize spacing based on page padding.
        top: `calc(${theme.variables.headerHeight.default}px + ${theme.spacing(
          4
        )})`,
      },
    };
  }

  return {};
});

/**
 * Element that hides the content scrolling behind the header when the header is sticky.
 */
const HeaderMask = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: `calc(100% - ${theme.spacing(2)})`,
  left: 0,
  width: "100%",
  height: 64,
  backgroundColor: theme.palette.backgrounds.page,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "10px",
  border: "2px solid",
  borderColor: "#ffffff",
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
}));
