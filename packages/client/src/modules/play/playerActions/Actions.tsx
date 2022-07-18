import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Box, CircularProgress, Rating, Typography } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { PlayBox } from "../Components";
import { ActionsHeader } from "./ActionsHeader";
import { Stage } from "../../stages";
import { usePlay } from "../context/playContext";
import { PlayerActions } from "../../../utils/types";

export { Actions };

function Actions({ currentStage }: { currentStage: Stage }) {
  return (
    <PlayBox>
      <ActionsHeader currentStage={currentStage} />
      <ActionsLayout step={currentStage.step} />
    </PlayBox>
  );
}

function ActionsLayout({ step }: { step: number }) {
  const {
    fetchPlayerActions,
    playerActions,
    setPlayerActionsLocal,
    playerActionsQuery,
  } = usePlay();

  fetchPlayerActions(step);

  if (playerActionsQuery.isLoading) {
    return <CircularProgress />;
  }

  const handleActionChange = (playerActionId: number, isPerformed: boolean) => {
    const playerActionIdx = playerActions.findIndex(
      (playerAction) => playerAction.id === playerActionId
    );

    if (playerActionIdx > -1) {
      playerActions[playerActionIdx].isPerformed = isPerformed;
      setPlayerActionsLocal([...playerActions]);
    }
  };

  return (
    <Box>
      {playerActions.map((playerAction) => {
        return (
          <ActionLayout
            key={playerAction.id}
            playerAction={playerAction}
            onPlayerActionChanged={(isPerformed) =>
              handleActionChange(playerAction.id, isPerformed)
            }
          />
        );
      })}
    </Box>
  );
}

const CustomCheckbox = styled(Checkbox)(() => ({
  path: {
    color: "#C4C4C4",
  },
}));

function ActionLayout({
  playerAction,
  onPlayerActionChanged,
}: {
  playerAction: PlayerActions;
  onPlayerActionChanged: (isPerformed: boolean) => void;
}) {
  const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPlayerActionChanged(event.target.checked);
  };

  return (
    <Box
      sx={{
        mb: 2,
        borderRadius: "5px",
        border: "3px solid #F9C74F",
        padding: 1,
      }}
    >
      <Typography alignItems="center" display="flex" variant="h6">
        <InfoIcon sx={{ mr: 1 }} />
        {playerAction.action.name}
        <CustomCheckbox
          checked={playerAction.isPerformed}
          onChange={handleActionChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Typography>
      <Box display="flex" alignItems="center" mt={1}>
        Coût :
        <Rating
          name="action-points-cost"
          readOnly
          max={3}
          value={playerAction.action.actionPointCost}
        />
        <PaidIcon />
        {`${playerAction.action.financialCost}€/j`}
      </Box>
    </Box>
  );
}
