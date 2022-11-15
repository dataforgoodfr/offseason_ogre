import { Typography } from "@mui/material";
import { PlayBox } from "../Components";
import { getOilgrePersonaDetails } from "./description";
import { AccordionLayout } from "../common/AccordionLayout";
import { formSections } from "../Personalization/models/form";

export { Persona };

function Persona() {
  return (
    <PlayBox>
      <Typography sx={{ textAlign: "center", mb: 2 }} variant="h3">
        Mes caractéristiques
      </Typography>
      {Object.entries(formSections).map((section: any) => {
        const [_, value] = section;
        return (
          <AccordionLayout title={value.title} titleIcon={value.titleIcon}>
            <Typography> {getOilgrePersonaDetails(value.name)} </Typography>
          </AccordionLayout>
        );
      })}
    </PlayBox>
  );
}
