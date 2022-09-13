import { Box, IconButton, useTheme } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import sumBy from "lodash/sumBy";
import { useState } from "react";

import { Typography } from "../../common/components/Typography";
import { useCurrentStep, useTeamActions } from "../context/playContext";
import { Icon } from "../../common/components/Icon";
import { computeTeamActionStats } from "../utils/production";
import { TeamAction } from "../../../utils/types";
import { Dialog } from "../../common/components/Dialog";
import { HelpIconWrapper } from "./TeamActionsHeader.styles";
import { t } from "../../translations";

export { TeamActionsHeader };

function TeamActionsHeader() {
  const currentStep = useCurrentStep();
  const { teamActionsAtCurrentStep } = useTeamActions();

  const [openHelp, setOpenHelp] = useState(false);

  const energyNameToEnergyStats = Object.fromEntries(
    teamActionsAtCurrentStep.map((teamAction) => [
      teamAction.action.name,
      computeTeamActionStats(teamAction),
    ])
  );

  const energyStats = Object.values(energyNameToEnergyStats);
  const budgetRemaining =
    (currentStep?.budgetAdvised || 0) - sumBy(energyStats, "cost");
  const powerInstalledInGw = sumBy(energyStats, "powerNeed");

  return (
    <>
      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Icon name="production" />
          <Typography variant="h5">{currentStep?.title}</Typography>
          <HelpIconWrapper>
            <IconButton
              aria-label="help with current step"
              onClick={() => setOpenHelp(true)}
            >
              <HelpIcon sx={{ color: "white" }} />
            </IconButton>
          </HelpIconWrapper>
        </Box>

        <Box style={{ gap: "4px" }} display="flex" flexDirection="column">
          <Box display="flex" alignItems="center">
            <Box sx={{ width: 300 }} display="flex" alignItems="center" gap={1}>
              <Icon name="budget" />
              <Typography>Budget alloué restant :</Typography>
            </Box>
            <Typography>{budgetRemaining.toFixed(2)} €/j</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box sx={{ width: 300 }} display="flex" alignItems="center" gap={1}>
              <Icon name="power" />
              <Typography>Puissance installée :</Typography>
            </Box>
            <Typography>{powerInstalledInGw.toFixed(0)} GW</Typography>
          </Box>
        </Box>

        <Box style={{ gap: "4px" }} display="flex" flexDirection="column">
          {teamActionsAtCurrentStep.map((teamAction) => (
            <EnergyListItem
              key={teamAction.action.name}
              teamAction={teamAction}
            />
          ))}
        </Box>
      </Box>

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

function EnergyListItem({ teamAction }: { teamAction?: TeamAction }) {
  const theme = useTheme();

  if (!teamAction) {
    return null;
  }

  const stats = computeTeamActionStats(teamAction);
  const color = teamAction.isTouched ? theme.palette.secondary.main : "white";

  return (
    <Box display="flex" alignItems="center" color={color}>
      <Box sx={{ width: 300 }} display="flex" alignItems="center" gap={1}>
        <Icon name="team" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
          }}
        >
          {!stats.isCredible && <Icon name="warning" sx={{ fontSize: 22 }} />}
        </div>
        <Typography>
          {t(`production.energy.${teamAction.action.name}.name`)} :
        </Typography>
      </Box>

      <Typography>
        {stats.powerNeed.toFixed(0)} GW &amp; {stats.cost.toFixed(2)} €/j
      </Typography>
    </Box>
  );
}
