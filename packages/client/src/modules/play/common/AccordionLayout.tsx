import { useTheme } from "@mui/material";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import { Icon, IconName } from "../../common/components/Icon";

export const AccordionLayout = ({
  children,
  title,
  titleIcon,
}: {
  children: JSX.Element;
  title: string;
  titleIcon: IconName;
}) => {
  const theme = useTheme();

  return (
    <Accordion
      sx={{
        mb: 2,
        borderRadius: "5px",
        border: "3px solid #F9C74F",
      }}
    >
      <AccordionSummary
        expandIcon={<Icon name="arrow-forward" />}
        aria-controls="infobh-content"
        id="infobh-header"
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          "& .MuiAccordionSummary-expandIconWrapper": {
            color: "white",
          },
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
          "& .MuiAccordionSummary-content": {
            color: "white",
          },
        }}
      >
        <Typography alignItems="center" display="flex" variant="h6">
          {titleIcon && <Icon name={titleIcon} sx={{ mr: 1 }} />}
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ pt: 2, bgcolor: theme.palette.primary.main, color: "white" }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
