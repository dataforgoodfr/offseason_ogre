import { Box } from "@mui/material";
import { useState } from "react";
import { usePlay } from "../context/playContext";
import { TeamConsoleContent } from "./TeamConsoleContent";
import { TeamConsoleHeader } from "./TeamConsoleHeader";

export { TeamConsoleLayout };

function TeamConsoleLayout() {
  const { game } = usePlay();

  const [selectedTeamId, setSelectedTeamId] = useState<number>(
    game.teams[0].id
  );

  const selectedTeam = game.teams.find(({ id }) => id === selectedTeamId);

  if (!selectedTeam) return <></>;

  return (
    <Box>
      <TeamConsoleHeader
        selectedTeamId={selectedTeamId}
        setSelectedTeamId={setSelectedTeamId}
      />
      <TeamConsoleContent team={selectedTeam} />
    </Box>
  );
}
