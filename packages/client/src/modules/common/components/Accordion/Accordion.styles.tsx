import { styled } from "@mui/material/styles";
import Accordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Icon } from "../Icon";

export { AccordionItemStyled, AccordionSummaryStyled, AccordionDetailsStyled };

const AccordionItemStyled = styled(
  (props: AccordionProps & { themeVariation: string }) => (
    <Accordion disableGutters elevation={0} square {...props} />
  )
)(({ theme, themeVariation }) => {
  if (themeVariation === "orange") {
    return {
      marginBottom: theme.spacing(2),
      borderRadius: "5px",
      color: "white",
      border: "3px solid #F9C74F",
      "&:before": {
        display: "none",
      },
    };
  }

  return {
    border: "2px solid white",
    borderRadius: "5px",
    color: "white",
    "&:not(:last-child)": {
      marginBottom: theme.spacing(1),
    },
    "&:before": {
      display: "none",
    },
  };
});

const AccordionSummaryStyled = styled(
  (props: AccordionSummaryProps & { valid: boolean }) => (
    <AccordionSummary
      expandIcon={<Icon name="arrow-forward" sx={{ color: "white" }} />}
      {...props}
    />
  )
)(({ theme, valid }) => ({
  backgroundColor: theme.palette.primary.main,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    color: valid ? theme.palette.primary.contrastText : "white",
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    color: "white",
  },
  "& .validIcon": {
    display: "flex",
  },
  "& .MuiAccordionSummary-content.Mui-expanded .validIcon": {
    display: "none",
  },
}));

const AccordionDetailsStyled = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));
