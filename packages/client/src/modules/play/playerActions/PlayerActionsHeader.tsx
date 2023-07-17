import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { Typography } from "../../common/components/Typography";
import { useCurrentStep } from "../context/playContext";
import { StepHelpDialog } from "./HelpDialogs";
import { Icon } from "../../common/components/Icon";
import { formatBudget, formatCarbonFootprint } from "../../../lib/formatter";
import {
  DashboardItem,
  CustomRating,
  HelpIconWrapper,
  Spacer,
  MediaQuery,
} from "./PlayerActionsHeader.styles";
import { useTranslation } from "../../translations";
import { usePersona, useCurrentPlayer } from "../context/hooks/player";

export { PlayerActionsHeader };

function PlayerActionsHeader() {
  const { t } = useTranslation(["common", "countries"]);
  const { latestPersona, currentPersona } = usePersona();
  const currentStep = useCurrentStep();

  const [openHelp, setOpenHelp] = useState(false);

  const handleClickOpenHelp = () => setOpenHelp(true);

  const handleCloseHelp = () => setOpenHelp(false);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Icon name="consumption" />
          <Typography variant="h5">
            {t(`step.${currentStep?.id}.title` as any)}
          </Typography>
          <Spacer />
          <HelpIconWrapper>
            <IconButton
              aria-label="help with current step"
              onClick={handleClickOpenHelp}
            >
              <Icon name="helper" sx={{ color: "white" }} />
            </IconButton>
          </HelpIconWrapper>
        </Box>

        <Box style={{ gap: "4px" }} display="flex" flexDirection="column">
          <DashboardItem>
            <Box display="flex" gap={1}>
              <Icon name="budget" />
              <Typography>
                {t("page.player.player-actions.remaining-budget")}
              </Typography>
            </Box>
            <Typography>
              {t("unit.budget-per-day.base", {
                value: formatBudget(latestPersona.budget),
                symbol: t("countries:country.fr.currency.symbol"),
              })}
            </Typography>
          </DashboardItem>
          <DashboardItem>
            <Box display="flex" gap={1}>
              <Icon name="carbon-footprint" />
              <Typography>
                {t("page.player.player-actions.carbon-footprint")}
              </Typography>
            </Box>
            <Typography>
              {t("unit.carbon-per-day.kilo", {
                value: formatCarbonFootprint(currentPersona.carbonFootprint),
              })}
            </Typography>
          </DashboardItem>
          <DashboardItem>
            <Box display="flex" gap={1}>
              <Icon name="action-points" />
              <Typography>
                {t("page.player.player-actions.used-action-points")}
              </Typography>
            </Box>
            <ActionPoints />
          </DashboardItem>
        </Box>
      </Box>

      <StepHelpDialog
        open={openHelp}
        handleClose={handleCloseHelp}
        message={t("page.player.player-actions.action.help")}
      />
    </>
  );
}

function ActionPoints() {
  const { t } = useTranslation();
  const { actionPointsUsedAtCurrentStep } = useCurrentPlayer();
  const currentStep = useCurrentStep();

  const availableActionPoints = currentStep?.availableActionPoints ?? 0;

  return (
    <MediaQuery>
      <CustomRating
        className="up-sm"
        emptyIcon={<Icon style={{ fill: "grey", opacity: 0.5 }} name="star" />}
        max={availableActionPoints}
        name="action-points"
        readOnly
        value={actionPointsUsedAtCurrentStep}
      />
      <Typography className="down-sm">
        {t("unit.action-point.base", {
          usedCount: actionPointsUsedAtCurrentStep,
          availableCount: availableActionPoints,
        })}
      </Typography>
    </MediaQuery>
  );
}
