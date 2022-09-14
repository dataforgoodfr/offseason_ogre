import { Box } from "@mui/material";
import { usePlay } from "../context/playContext";
import { useState } from "react";
import { TeamDetails } from "./Teams";
import { TeamConsoleHeader } from "./TeamConsoleHeader";

export { TeamConsoleLayout };

function TeamConsoleLayout() {
  const { game } = usePlay();
  const firstTeamId = game.teams[0].id;
  const [selectedTeamId, setSelectedTeamId] = useState<number>(firstTeamId);
  const selectedTeam = game.teams.find(({ id }) => id === selectedTeamId);
  if (!selectedTeam) return <></>;

  return (
    <Box>
      <TeamConsoleHeader
        selectedTeamId={selectedTeamId}
        setSelectedTeamId={setSelectedTeamId}
      />
      <TeamDetails team={selectedTeam} />
    </Box>
  );
}
