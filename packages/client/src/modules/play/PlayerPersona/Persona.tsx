import { Typography } from "@mui/material";
import { PlayBox } from "../Components";
import { getOilgrePersonaDetails } from "./description";
import { Accordion } from "../../common/components/Accordion";
import { Icon } from "../../common/components/Icon";
import { formSections } from "../Personalization/models/form";

export { Persona };

function Persona() {
  return (
    <PlayBox>
      <Typography sx={{ textAlign: "center", mb: 2 }} variant="h3">
        Mes caractéristiques
      </Typography>
      <Accordion
        options={Object.entries(formSections).map(
          ([_, value]: [string, any]) => {
            return {
              key: value.name,
              header: (
                <Typography alignItems="center" display="flex" variant="h6">
                  {value.titleIcon && (
                    <Icon name={value.titleIcon} sx={{ mr: 1 }} />
                  )}
                  {value.title}
                </Typography>
              ),
              content: getOilgrePersonaDetails(value.name),
              themeVariation: "orange",
            };
          }
        )}
      />
    </PlayBox>
  );
}
