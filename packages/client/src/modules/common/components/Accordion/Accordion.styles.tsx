import { styled } from "@mui/material/styles";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Accordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

export { AccordionItemStyled, AccordionSummaryStyled, AccordionDetailsStyled };

const AccordionItemStyled = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: "2px solid white",
  borderRadius: "5px",
  color: "white",
  "&:not(:last-child)": {
    marginBottom: theme.spacing(1),
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummaryStyled = styled((props: AccordionSummaryProps) => (
  <AccordionSummary
    expandIcon={<KeyboardArrowRightIcon sx={{ color: "white" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(-90deg)",
  },
}));

const AccordionDetailsStyled = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));
