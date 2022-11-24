import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export { DescriptionValue };

const DescriptionValue = styled(Typography)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.contrastText}`,
  borderRadius: "2px",
  padding: `${theme.spacing(1)} ${theme.spacing(3)} ${theme.spacing(
    1
  )} ${theme.spacing(3)}`,
}));
