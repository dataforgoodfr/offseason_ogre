import { Box, useTheme } from "@mui/material";
import sumBy from "lodash/sumBy";
import React, { ReactNode, useMemo } from "react";

import { Typography } from "../../../common/components/Typography";
import { useCurrentStep, usePlay } from "../../context/playContext";
import { Icon } from "../../../common/components/Icon";
import { computeTeamActionStats } from "../../utils/production";
import { TeamAction } from "../../../../utils/types";
import { useTranslation } from "../../../translations";
import { HelpIconWrapper } from "./TeamActionsRecap.styles";
import { formatBudget, formatProductionGw } from "../../../../lib/formatter";

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
  const { t } = useTranslation(["common", "countries"]);
  const currentStep = useCurrentStep();
  const { productionActionById } = usePlay();

  const energyNameToEnergyStats = Object.fromEntries(
    teamActions.map((teamAction) => [
      productionActionById[teamAction.actionId].name,
      computeTeamActionStats(teamAction, productionActionById),
    ])
  );

  const budgetI18n = useMemo(() => {
    if (currentStep?.id === "production-3") {
      return t("team-actions.recap.remaining-budget");
    }
    return t("team-actions.recap.recommended-remaining-budget");
  }, [currentStep, t]);

  const energyStats = Object.values(energyNameToEnergyStats);
  const budgetRemaining =
    (currentStep?.budgetAdvised || 0) - sumBy(energyStats, "cost");
  const powerInstalledInGw = sumBy(energyStats, "powerNeedGw");

  return (
    <Box
      className="team-actions-recap"
      display="flex"
      flexDirection="column"
      gap={3}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Icon name="production" />
        <Typography variant="h5">{title || currentStep?.title}</Typography>
        {helper && <HelpIconWrapper>{helper}</HelpIconWrapper>}
      </Box>

      <Box
        className="team-actions-recap__overview"
        style={{ gap: "4px" }}
        display="flex"
        flexDirection="column"
      >
        <OverviewItem
          title={
            <>
              <Icon name="power" />
              <Typography>
                {t("team-actions.recap.installed-power")} :
              </Typography>
            </>
          }
          value={
            <>
              <Typography>
                {t("unit.power.giga", {
                  value: formatProductionGw(powerInstalledInGw),
                })}
              </Typography>
            </>
          }
        />
        {currentStep?.budgetAdvised && (
          <OverviewItem
            title={
              <>
                <Icon name="budget" />
                <Typography>{budgetI18n} :</Typography>
              </>
            }
            value={
              <>
                <Typography>
                  {t("unit.budget-per-day.base", {
                    value: formatBudget(budgetRemaining),
                    symbol: t("countries:country.fr.currency.symbol"),
                  })}
                </Typography>
              </>
            }
          />
        )}
      </Box>

      <Box
        className="team-actions-recap__energy-list"
        display="flex"
        flexDirection="column"
        gap={1}
      >
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

function OverviewItem({
  title,
  value,
}: {
  title: ReactNode;
  value: ReactNode;
}) {
  return (
    <Box
      className="overview-item"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: "100%", maxWidth: 325 }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {title}
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        {value}
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
  const { t } = useTranslation(["common", "countries", "production-actions"]);
  const { productionActionById } = usePlay();

  if (!teamAction) {
    return null;
  }

  const productionAction = productionActionById[teamAction.actionId];
  const stats = computeTeamActionStats(teamAction, productionActionById);
  const color = teamAction.isTouched ? theme.palette.secondary.main : "white";

  return (
    <Box
      className="energy-list-item"
      display="flex"
      alignItems="start"
      gap={1}
      color={color}
    >
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
          {t(
            `production-actions:production-action.fr.${productionAction.name}.name`
          )}
        </Typography>

        {showProductionValue && (
          <Typography>
            {t(
              `production-actions:production-action.fr.${productionAction.name}.accordion.label-slider`
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
              {t("unit.power.giga", {
                value: formatProductionGw(stats.powerNeedGw),
              })}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Icon name="budget" />
            <Typography as="span">
              {t("unit.budget-per-day.base", {
                value: formatBudget(stats.cost),
                symbol: t("countries:country.fr.currency.symbol"),
              })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
