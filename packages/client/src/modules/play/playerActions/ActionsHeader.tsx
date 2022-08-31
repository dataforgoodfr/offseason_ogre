import { Box, IconButton } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaidIcon from "@mui/icons-material/Paid";
import CloudIcon from "@mui/icons-material/Cloud";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";

import { Typography } from "../../common/components/Typography";
import {
  useCurrentStep,
  usePersona,
  usePlayerActions,
} from "../context/playContext";
import { Stage } from "../../stages";
import { StepHelpDialog } from "./HelpDialogs";
import { CustomRating, HelpIconWrapper, Spacer } from "./ActionsHeader.styles";

export { ActionsHeader };

function ActionsHeader({ currentStage }: { currentStage: Stage }) {
  const { latestPersona } = usePersona();

  const [openHelp, setOpenHelp] = useState(false);

  const handleClickOpenHelp = () => setOpenHelp(true);

  const handleCloseHelp = () => setOpenHelp(false);

  const helpMessage =
    "Tu peux utiliser tes points d’action pour réduire ta consommation. Tu en as un nombre limité, alors utilise-les à bon escient. Tu ne peux les utiliser que pour ce tour. Fais attention car certaines actions coûtent de l’argent en plus des points d’action.";

  return (
    <>
      <Box mt={2} mb={2}>
        <Box display="flex" alignItems="center">
          <ShoppingCartIcon />
          <Typography ml={1} mr={2} variant="h5">
            {currentStage?.title}
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
        <Box display="flex" alignItems="center" mt={1}>
          <PaidIcon />
          <Typography
            ml={1}
          >{`Budget restant: ${latestPersona.budget} €/j`}</Typography>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
          <CloudIcon />
          <Typography
            ml={1}
          >{`Bilan carbone: ${latestPersona.carbonFootprint} kgCO2/an`}</Typography>
        </Box>
        <ActionPoints />
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

  return (
    <Box display="flex" alignItems="center" mt={1}>
      <Typography>PA utilisés:</Typography>
      <CustomRating
        emptyIcon={
          <StarIcon style={{ fill: "grey", opacity: 0.5 }} fontSize="inherit" />
        }
        max={currentStep?.availableActionPoints ?? 0}
        name="action-points"
        readOnly
        value={actionPointsUsedAtCurrentStep}
      />
    </Box>
  );
}
