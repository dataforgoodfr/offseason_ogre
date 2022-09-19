import { Box, useTheme } from "@mui/material";
import sumBy from "lodash/sumBy";
import React from "react";

import { Typography } from "../../../common/components/Typography";
import { useCurrentStep } from "../../context/playContext";
import { Icon } from "../../../common/components/Icon";
import { computeTeamActionStats } from "../../utils/production";
import { TeamAction } from "../../../../utils/types";
import { t } from "../../../translations";
import { HelpIconWrapper } from "./TeamActionsRecap.styles";
import { formatBudget, formatProductionGw } from "../../../../lib/formatter";
import { GameStepId } from "../../constants";

export { TeamActionsRecap };

function TeamActionsRecap({
  title,
  teamActions = [],
  helper,
}: {
  title?: string;
  teamActions: TeamAction[];
  helper?: React.ReactNode;
}) {
  const currentStep = useCurrentStep();

  const energyNameToEnergyStats = Object.fromEntries(
    teamActions.map((teamAction) => [
      teamAction.action.name,
      computeTeamActionStats(teamAction),
    ])
  );

  function budgetWording(stepId: GameStepId): string {
    if (stepId === "production-3") {
      return "Budget restant :";
    }
    return "Budget conseillé restant :";
  }

  const energyStats = Object.values(energyNameToEnergyStats);
  const budgetRemaining =
    (currentStep?.budgetAdvised || 0) - sumBy(energyStats, "cost");
  const powerInstalledInGw = sumBy(energyStats, "powerNeed");

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" alignItems="center" gap={1}>
        <Icon name="production" />
        <Typography variant="h5">{title || currentStep?.title}</Typography>
        {helper && <HelpIconWrapper>{helper}</HelpIconWrapper>}
      </Box>

      <Box style={{ gap: "4px" }} display="flex" flexDirection="column">
        <Box display="flex" alignItems="center">
          <Box sx={{ width: 300 }} display="flex" alignItems="center" gap={1}>
            <Icon name="budget" />
            <Typography>
              {budgetWording(currentStep?.id || "initial-situation")}
            </Typography>
          </Box>
          <Typography>{formatBudget(budgetRemaining)} €/j</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box sx={{ width: 300 }} display="flex" alignItems="center" gap={1}>
            <Icon name="power" />
            <Typography>Puissance installée :</Typography>
          </Box>
          <Typography>{formatProductionGw(powerInstalledInGw)} GW</Typography>
        </Box>
      </Box>

      <Box style={{ gap: "4px" }} display="flex" flexDirection="column">
        {teamActions.map((teamAction) => (
          <EnergyListItem
            key={teamAction.action.name}
            teamAction={teamAction}
          />
        ))}
      </Box>
    </Box>
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
        {formatProductionGw(stats.powerNeedGw)} GW &amp;{" "}
        {formatBudget(stats.cost)} €/j
      </Typography>
    </Box>
  );
}
