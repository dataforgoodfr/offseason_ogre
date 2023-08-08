import { styled } from "@mui/material/styles";
import Accordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Icon } from "../Icon";
import { ThemeVariation } from "./Accordion";

export { AccordionItemStyled, AccordionSummaryStyled, AccordionDetailsStyled };

const AccordionItemStyled = styled(
  (
    props: AccordionProps & {
      themeVariation?: ThemeVariation;
    }
  ) => <Accordion disableGutters elevation={0} square {...props} />
)(({ theme, themeVariation }) => {
  const commonCss = {
    borderRadius: "5px",
    borderWidth: "2px",
    borderColor: "#ffffff",
    borderStyle: "solid",
    "&:before": {
      display: "none",
    },
    color: "#ffffff",
  };

  const largeVariationCss = {
    borderWidth: "3px",
  };

  let themeCss = {};
  if (themeVariation?.includes("accent")) {
    themeCss = {
      borderColor: "#F9C74F",
    };
  } else if (themeVariation === "default-large") {
    themeCss = {
      borderColor: "#ffffff",
    };
  }

  themeCss = themeVariation?.includes("large")
    ? { ...largeVariationCss, ...themeCss }
    : themeCss;

  return { ...commonCss, ...themeCss };
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
}));

const AccordionDetailsStyled = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
}));
