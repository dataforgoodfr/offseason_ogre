import { BoxProps } from "@mui/material";
import { ReactNode } from "react";
import { HeaderMask, HeaderSection, StyledBox } from "./PlayBox.styles";

export { PlayBox };

function PlayBox({
  header = null,
  headerSticky = false,
  children,
  ...boxProps
}: { header?: ReactNode; headerSticky?: boolean } & BoxProps = {}) {
  if (header) {
    return (
      <>
        <HeaderSection headerSticky={headerSticky}>
          <HeaderMask />
          <StyledBox
            position="relative"
            borderRadius="10px 10px 0 0 !important"
            borderBottom="0 !important"
            {...boxProps}
          >
            {header}
          </StyledBox>
        </HeaderSection>
        <StyledBox
          borderRadius="0 0 10px 10px !important"
          borderTop="0 !important"
          {...boxProps}
        >
          {children}
        </StyledBox>
      </>
    );
  }

  return <StyledBox {...boxProps}>{children}</StyledBox>;
}
