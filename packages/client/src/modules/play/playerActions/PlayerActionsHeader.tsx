import { Box, IconButton } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { useState } from "react";
import { Typography } from "../../common/components/Typography";
import {
  useCurrentStep,
  usePersona,
  usePlayerActions,
} from "../context/playContext";
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
import { t } from "../../translations";

export { PlayerActionsHeader };

function PlayerActionsHeader() {
  const { latestPersona } = usePersona();
  const currentStep = useCurrentStep();

  const [openHelp, setOpenHelp] = useState(false);

  const handleClickOpenHelp = () => setOpenHelp(true);

  const handleCloseHelp = () => setOpenHelp(false);

  const helpMessage =
    "Tu peux utiliser tes points d’action pour réduire ta consommation. Tu en as un nombre limité, alors utilise-les à bon escient. Tu ne peux les utiliser que pour ce tour. Fais attention car certaines actions coûtent de l’argent en plus des points d’action.";

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
              <HelpIcon sx={{ color: "white" }} />
            </IconButton>
          </HelpIconWrapper>
        </Box>

        <Box style={{ gap: "4px" }} display="flex" flexDirection="column">
          <DashboardItem>
            <Box display="flex" gap={1}>
              <Icon name="budget" />
              <Typography>Budget restant :</Typography>
            </Box>
            <Typography>{formatBudget(latestPersona.budget)} €/j</Typography>
          </DashboardItem>
          <DashboardItem>
            <Box display="flex" gap={1}>
              <Icon name="carbon-footprint" />
              <Typography>Bilan carbone :</Typography>
            </Box>
            <Typography>
              {formatCarbonFootprint(latestPersona.carbonFootprint)} kgCO2/an
            </Typography>
          </DashboardItem>
          <DashboardItem>
            <Box display="flex" gap={1}>
              <Icon name="action-points" />
              <Typography>Points d'action utilisés :</Typography>
            </Box>
            <ActionPoints />
          </DashboardItem>
        </Box>
      </Box>

      <StepHelpDialog
        open={openHelp}
        handleClose={handleCloseHelp}
        message={helpMessage}
      />
    </>
  );
}

function ActionPoints() {
  const { actionPointsUsedAtCurrentStep } = usePlayerActions();
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
        {actionPointsUsedAtCurrentStep}/{availableActionPoints}{" "}
      </Typography>
    </MediaQuery>
  );
}
