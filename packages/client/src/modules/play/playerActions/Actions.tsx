import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Rating, IconButton } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

import { theme } from "../../../utils/theme";
import { Spacer } from "../../common/components/Spacer";
import { Typography } from "../../common/components/Typography";
import { PlayBox } from "../Components";
import { ActionsHeader } from "./ActionsHeader";
import { Stage } from "../../stages";
import { actionHelpCards } from "../../actions";
import { useState } from "react";
import { PlayerActions } from "../../../utils/types";
import { usePlay } from "../context/playContext";
import { ActionHelpDialog } from "./HelpDialogs";

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
            helpCardLink={
              actionHelpCards.filter(
                (actionHelpCard) =>
                  actionHelpCard.name === playerAction.action.name
              )[0].helpCardLink
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
  helpCardLink,
}: {
  playerAction: PlayerActions;
  onPlayerActionChanged: (isPerformed: boolean) => void;
  helpCardLink: string;
}) {
  const [openHelp, setOpenHelp] = useState(false);

  const handleClickOpenHelp = () => setOpenHelp(true);
  const handleCloseHelp = () => setOpenHelp(false);

  const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPlayerActionChanged(event.target.checked);
  };

  const helpMessage =
    "Voici le lien vers une carte qui te permettra de mieux comprendre les implications de ce choix";

  return (
    <Box
      sx={{
        display: "flex",
        marginBottom: 2,
        padding: 1,
        borderRadius: 1,
        border: `3px solid ${theme.palette.secondary.main}`,
      }}
    >
      <Box>
        <Typography alignItems="center" display="flex" variant="h6">
          <IconButton
            aria-label="help with current step"
            sx={{ paddingLeft: 0 }}
            onClick={handleClickOpenHelp}
          >
            <InfoIcon sx={{ marginRight: 1, color: "white" }} />
          </IconButton>
          <ActionHelpDialog
            open={openHelp}
            handleClose={handleCloseHelp}
            message={helpMessage}
            helpCardLink={helpCardLink}
          />
          {playerAction.action.name}
        </Typography>
        <Box sx={{ gap: 2 }} display="flex" alignItems="center" mt={1}>
          <Box sx={{ gap: 1 }} display="flex" alignItems="center">
            Coût :
            <Rating
              name="action-points-cost"
              readOnly
              max={3}
              value={playerAction.action.actionPointCost}
            />
          </Box>
          <Box sx={{ gap: 1 }} display="flex" alignItems="center">
            <PaidIcon />
            {`${playerAction.action.financialCost}€/j`}
          </Box>
        </Box>
      </Box>

      <Spacer />

      <CustomCheckbox
        checked={playerAction.isPerformed}
        onChange={handleActionChange}
        inputProps={{ "aria-label": "controlled" }}
      />
    </Box>
  );
}
