import { Box, useTheme } from "@mui/material";
import sumBy from "lodash/sumBy";
import React from "react";

import { Typography } from "../../../common/components/Typography";
import { useCurrentStep, usePlay } from "../../context/playContext";
import { Icon } from "../../../common/components/Icon";
import { computeTeamActionStats } from "../../utils/production";
import { TeamAction } from "../../../../utils/types";
import { useTranslation } from "../../../translations";
import { HelpIconWrapper } from "./TeamActionsRecap.styles";
import { formatBudget, formatProductionGw } from "../../../../lib/formatter";
import { GameStepId } from "../../constants";

export { TeamActionsRecap };

function TeamActionsRecap({
  title,
  teamActions = [],
  helper,
  showCredibility,
  showProductionValue,
}: {
  title?: string;
  teamActions: TeamAction[];
  helper?: React.ReactNode;
  showCredibility?: boolean;
  showProductionValue?: boolean;
}) {
  const currentStep = useCurrentStep();
  const { productionActionById } = usePlay();

  const energyNameToEnergyStats = Object.fromEntries(
    teamActions.map((teamAction) => [
      productionActionById[teamAction.actionId].name,
      computeTeamActionStats(teamAction, productionActionById),
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
  const powerInstalledInGw = sumBy(energyStats, "powerNeedGw");

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
            <Icon name="power" />
            <Typography>Puissance installée :</Typography>
          </Box>
          <Typography>{formatProductionGw(powerInstalledInGw)} GW</Typography>
        </Box>
        {currentStep?.budgetAdvised && (
          <Box display="flex" alignItems="center">
            <Box sx={{ width: 300 }} display="flex" alignItems="center" gap={1}>
              <Icon name="budget" />
              <Typography>
                {budgetWording(currentStep?.id || "initial-situation")}
              </Typography>
            </Box>
            <Typography>{formatBudget(budgetRemaining)} €/j</Typography>
          </Box>
        )}
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        {teamActions.map((teamAction) => (
          <EnergyListItem
            key={productionActionById[teamAction.actionId].name}
            teamAction={teamAction}
            showCredibility={showCredibility}
            showProductionValue={showProductionValue}
          />
        ))}
      </Box>
    </Box>
  );
}

function EnergyListItem({
  teamAction,
  showCredibility,
  showProductionValue,
}: {
  teamAction?: TeamAction;
  showCredibility?: boolean;
  showProductionValue?: boolean;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { productionActionById } = usePlay();

  if (!teamAction) {
    return null;
  }

  const productionAction = productionActionById[teamAction.actionId];
  const stats = computeTeamActionStats(teamAction, productionActionById);
  const color = teamAction.isTouched ? theme.palette.secondary.main : "white";

  return (
    <Box display="flex" alignItems="start" gap={1} color={color}>
      <Box display="flex" gap={1}>
        <Icon name="team" />
        {showCredibility && (
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
        )}
      </Box>

      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Typography>
          {t(`production.energy.${productionAction.name}.name`)}
        </Typography>

        {showProductionValue && (
          <Typography>
            {t(
              `production.energy.${productionAction.name}.accordion.label-slider`
            )}{" "}
            :{" "}
            {productionAction.unit === "percentage"
              ? t("unit.percentage", { value: teamAction.value })
              : t("unit.area.base", { value: teamAction.value })}
          </Typography>
        )}

        <Box display="grid" gridTemplateColumns="1fr 1fr" maxWidth={300}>
          <Box display="flex" alignItems="center" gap={1}>
            <Icon name="power" />
            <Typography as="span">
              {formatProductionGw(stats.powerNeedGw)} GW
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Icon name="budget" />
            <Typography as="span">{formatBudget(stats.cost)} €/j</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
