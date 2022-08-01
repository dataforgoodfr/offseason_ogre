import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Rating, Typography } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { PlayBox } from "../Components";
import { ActionsHeader } from "./ActionsHeader";
import { Stage } from "../../stages";
import { PlayerActions } from "../../../utils/types";
import { usePlay } from "../context/playContext";

export { Actions };

function Actions({ currentStage }: { currentStage: Stage }) {
  return (
    <PlayBox>
      <ActionsHeader currentStage={currentStage} />
      <ActionsLayout />
    </PlayBox>
  );
}

function ActionsLayout() {
  const { playerActions, updatePlayerActions } = usePlay();

  const handleActionChange = (playerActionId: number, isPerformed: boolean) => {
    updatePlayerActions(
      playerActions.map((pa) => ({
        id: pa.id,
        isPerformed: pa.id === playerActionId ? isPerformed : pa.isPerformed,
      }))
    );
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
