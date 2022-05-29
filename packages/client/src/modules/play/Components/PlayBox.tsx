import { Box, BoxProps, useTheme } from "@mui/material";

export { PlayBox };

function PlayBox(boxProps: BoxProps = {}) {
  const theme = useTheme();
  return (
    <Box
      bgcolor={theme.palette.primary.main}
      border="2px solid white"
      borderRadius="10px"
      color="white"
      p={2}
      {...boxProps}
    ></Box>
  );
}
