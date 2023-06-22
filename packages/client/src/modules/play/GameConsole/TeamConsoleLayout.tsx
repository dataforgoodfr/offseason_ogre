import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { usePlay } from "../context/playContext";
import { TeamConsoleContent } from "./TeamConsoleContent";
import { TeamConsoleHeader } from "./TeamConsoleHeader";

export { TeamConsoleLayout };

function TeamConsoleLayout() {
  const { teams } = usePlay();

  const [selectedTeamId, setSelectedTeamId] = useState<number>(
    teams[0]?.id || 0
  );

  const selectedTeam = useMemo(
    () => teams.find(({ id }) => id === selectedTeamId),
    [selectedTeamId, teams]
  );

  useEffect(() => {
    if (!selectedTeamId && teams.length) {
      setSelectedTeamId(teams[0].id);
    }
  }, [selectedTeamId, teams]);

  if (!selectedTeamId || !selectedTeam) return <></>;

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
