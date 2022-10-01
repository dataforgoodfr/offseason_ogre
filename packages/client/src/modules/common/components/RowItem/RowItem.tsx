import Box, { BoxProps } from "@mui/material/Box";

export { RowItem };

interface RowItemProps {
  left: React.ReactNode;
  right: React.ReactNode;
  sx: BoxProps["sx"];
}

function RowItem({ left, right, sx }: RowItemProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={sx}
    >
      <Box display="flex" alignItems="center">
        {left}
      </Box>
      <Box display="flex" alignItems="center">
        {right}
      </Box>
    </Box>
  );
}
