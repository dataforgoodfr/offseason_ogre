import { Typography } from "@mui/material";
import { Box, Rating, IconButton } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaidIcon from "@mui/icons-material/Paid";
import CloudIcon from "@mui/icons-material/Cloud";
import StarIcon from "@mui/icons-material/Star";
import { useCurrentPersona } from "../context/playContext";
import { Stage } from "../../stages";
import React, { useState } from "react";
import { StepHelpDialog } from "./HelpDialogs";

export { ActionsHeader };

function ActionsHeader({ currentStage }: { currentStage: Stage }) {
  const persona = useCurrentPersona();
  const [openHelp, setOpenHelp] = useState(false);
  const handleClickOpenHelp = () => setOpenHelp(true);
  const handleCloseHelp = () => setOpenHelp(false);
  const helpMessage =
    "Tu peux utiliser tes points d’action pour réduire ta consommation. Tu en as un nombre limité, alors utilise-les à bon escient. Tu ne peux les utiliser que pour ce tour. Fais attention car certaines actions coûtent de l’argent en plus des points d’action.";

  return (
    <Box mt={2} mb={2}>
      <Box display="flex" alignItems="center">
        <ShoppingCartIcon />
        <Typography ml={1} mr={2} variant="h5">
          {currentStage?.title}
        </Typography>
        <IconButton
          aria-label="help with current step"
          onClick={handleClickOpenHelp}
        >
          <HelpIcon sx={{ color: "white" }} />
        </IconButton>
        <StepHelpDialog
          open={openHelp}
          handleClose={handleCloseHelp}
          message={helpMessage}
        />
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
      <ActionPoints available_points={currentStage?.available_points} />
    </Box>
  );
}

function ActionPoints({ available_points }: { available_points: number }) {
  const persona = useCurrentPersona();
  return (
    <Box display="flex" alignItems="center" mt={1}>
      <Typography>PA utilisés:</Typography>
      <Rating
        emptyIcon={
          <StarIcon style={{ fill: "grey", opacity: 0.5 }} fontSize="inherit" />
        }
        max={available_points ?? 0}
        name="action-points"
        readOnly
        value={(available_points ?? 0) - persona.points}
      />
    </Box>
  );
}
