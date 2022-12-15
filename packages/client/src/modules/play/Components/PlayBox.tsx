import { Box, BoxProps, useTheme } from "@mui/material";
import { ReactNode } from "react";
import { HeaderMask, HeaderSection } from "./PlayBox.styles";

export { PlayBox };

function PlayBox({
  header = null,
  headerSticky = false,
  children,
  ...boxProps
}: { header?: ReactNode; headerSticky?: boolean } & BoxProps = {}) {
  const theme = useTheme();

  if (header) {
    return (
      <>
        <HeaderSection headerSticky={headerSticky}>
          <HeaderMask />
          <Box
            position="relative"
            bgcolor={theme.palette.primary.main}
            border="2px solid"
            borderBottom="none"
            borderColor="white"
            borderRadius="10px 10px 0 0"
            color="white"
            p={2}
            {...boxProps}
          >
            {header}
          </Box>
        </HeaderSection>
        <Box
          bgcolor={theme.palette.primary.main}
          border="2px solid"
          borderTop="none"
          borderColor="white"
          borderRadius="0 0 10px 10px"
          color="white"
          p={2}
          {...boxProps}
        >
          {children}
        </Box>
      </>
    );
  }

  return (
    <Box
      bgcolor={theme.palette.primary.main}
      border="2px solid"
      borderColor="white"
      borderRadius="10px"
      color="white"
      p={2}
      {...boxProps}
    >
      {children}
    </Box>
  );
}
