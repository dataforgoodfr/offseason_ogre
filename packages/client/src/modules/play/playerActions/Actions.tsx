import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Rating } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

import { Typography } from "@mui/material";
import { PlayBox } from "../Components";
import { ActionsHeader } from "./ActionsHeader";
import { Stage } from "../../stages";

import { useQuery } from "react-query";
import axios from "axios";
import { CircularProgress } from "@mui/material";
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
  const { game } = usePlay();

  const query = useQuery("actions", () => {
    return axios.get<undefined, { data: { playerActions: PlayerActions[] } }>(
      `/api/actions/me?step=${step}&gameId=${game.id}`
    );
  });
  if (query.isLoading) {
    return <CircularProgress />;
  }
  const playerActions = query?.data?.data?.playerActions ?? [];

  return (
    <Box>
      {playerActions.map((playerAction) => {
        return (
          <ActionLayout
            key={playerAction.id}
            playerActionId={playerAction.id}
            title={playerAction.action.name}
            financialCost={playerAction.action.financialCost}
            actionPointCost={playerAction.action.actionPointCost}
            isPerformed={playerAction.isPerformed}
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
  playerActionId,
  title,
  financialCost,
  actionPointCost,
  isPerformed,
}: {
  playerActionId: number;
  title: string;
  financialCost: number;
  actionPointCost: number;
  isPerformed: boolean;
}) {
  const { updatePlayerActions } = usePlay();

  const [checked, setChecked] = React.useState(isPerformed);

  React.useEffect(() => {
    setChecked(isPerformed);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    updatePlayerActions([
      { id: playerActionId, isPerformed: event.target.checked },
    ]);
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
        {title}
        <CustomCheckbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Typography>
      <Box display="flex" alignItems="center" mt={1}>
        Coût :
        <Rating
          name="action-points-cost"
          readOnly
          max={3}
          value={actionPointCost}
        />
        <PaidIcon />
        {`${financialCost}€/j`}
      </Box>
    </Box>
  );
}
