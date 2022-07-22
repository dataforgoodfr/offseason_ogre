import { Typography } from "@mui/material";
import { Box, Rating } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaidIcon from "@mui/icons-material/Paid";
import CloudIcon from "@mui/icons-material/Cloud";
import StarIcon from "@mui/icons-material/Star";
import { useCurrentPersona, useCurrentStep } from "../context/playContext";
import { Stage } from "../../stages";
import { usePlayerActions } from "./usePlayerActions";

export { ActionsHeader };

function ActionsHeader({ currentStage }: { currentStage: Stage }) {
  const persona = useCurrentPersona();

  return (
    <Box mt={2} mb={2}>
      <Box display="flex" alignItems="center">
        <ShoppingCartIcon />
        <Typography ml={1} mr={2} variant="h5">
          {currentStage?.title}
        </Typography>
        <HelpIcon />
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        <PaidIcon />
        <Typography
          ml={1}
        >{`Budget restant: ${persona.budget} €/j`}</Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        <CloudIcon />
        <Typography
          ml={1}
        >{`Bilan carbone: ${persona.carbonFootprint} kgCO2/an`}</Typography>
      </Box>
      <ActionPoints />
    </Box>
  );
}

function ActionPoints() {
  const { actionPointsUsedAtCurrentStep } = usePlayerActions();
  let currentStep = useCurrentStep();

  return (
    <Box display="flex" alignItems="center" mt={1}>
      <Typography>PA utilisés:</Typography>
      <Rating
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
