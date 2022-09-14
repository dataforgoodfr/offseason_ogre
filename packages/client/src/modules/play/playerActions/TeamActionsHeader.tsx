import { IconButton } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { useState } from "react";

import { Typography } from "../../common/components/Typography";
import { useTeamActions } from "../context/playContext";
import { Dialog } from "../../common/components/Dialog";
import { TeamActionsRecap } from "../Components/TeamActionsRecap";

export { TeamActionsHeader };

function TeamActionsHeader() {
  const { teamActionsAtCurrentStep } = useTeamActions();

  const [openHelp, setOpenHelp] = useState(false);

  return (
    <>
      <TeamActionsRecap
        teamActions={teamActionsAtCurrentStep}
        helper={
          <IconButton
            aria-label="help with current step"
            onClick={() => setOpenHelp(true)}
          >
            <HelpIcon sx={{ color: "white" }} />
          </IconButton>
        }
      />

      <Dialog open={openHelp} handleClose={() => setOpenHelp(false)}>
        <>
          <Typography>
            En équipe, vous devez décider des moyens de production électriques à
            installer en France d’ici 2050 pour répondre aux besoins
            énergétiques de chacun.
          </Typography>
          <br />
          <Typography>
            Pour chaque moyen de production, choisissez puis validez la
            puissance à installer. Attention, une seule personne doit valider la
            valeur pour toute l’équipe.
          </Typography>
          <br />
          <Typography>
            Chaque moyen de production a un coût nominal. Vous avez un budget
            conseillé qui n’est là qu’à titre indicatif. Faites attention à
            votre budget global.
          </Typography>
        </>
      </Dialog>
    </>
  );
}
