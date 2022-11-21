import * as React from "react";
import {
  AccordionDetailsStyled,
  AccordionItemStyled,
  AccordionSummaryStyled,
} from "./Accordion.styles";

export { Accordion };

interface AccordionProps {
  options: {
    key: string;
    header: React.ReactNode;
    content: React.ReactNode;
    themeVariation?: string;
    valid?: boolean;
  }[];
}

function Accordion({ options }: AccordionProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const handleExpandPanel =
    (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : null);
    };

  const getPanelName = (idx: number): string => `panel-${idx}`;

  return (
    <div>
      {options.map((option, idx) => (
        <AccordionItemStyled
          className={`accordion__item-${getPanelName(idx)}`}
          key={option.key}
          expanded={expanded === getPanelName(idx)}
          onChange={handleExpandPanel(getPanelName(idx))}
          themeVariation={option.themeVariation || "default"}
        >
          <AccordionSummaryStyled
            className={`accordion__item-${getPanelName(idx)}__summary`}
            aria-controls={`${getPanelName(idx)}-content`}
            id={`${getPanelName(idx)}-header`}
            valid={option.valid || false}
          >
            {option.header}
          </AccordionSummaryStyled>
          <AccordionDetailsStyled
            className={`accordion__item-${getPanelName(idx)}__details`}
          >
            {option.content}
          </AccordionDetailsStyled>
        </AccordionItemStyled>
      ))}
    </div>
  );
}
