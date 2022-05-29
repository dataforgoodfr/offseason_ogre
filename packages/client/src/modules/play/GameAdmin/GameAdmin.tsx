import { Box, Grid, Tooltip, Typography, useTheme } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { ITeamWithPlayers } from "../../../utils/types";
import GameStepper from "../../common/components/Stepper";
import { PlayBox } from "../Components";
import { PlayProvider, usePlay } from "../context/playContext";
import { PlayLayout } from "../PlayLayout";
import { useState } from "react";
import { PlayerList } from "./PlayerList";

export { GameAdmin };

function GameAdmin() {
  return (
    <PlayLayout title="Console Animateur">
      <PlayProvider>
        <GameAdminContent />
      </PlayProvider>
    </PlayLayout>
  );
}

function GameAdminContent() {
  const { game } = usePlay();
  const firstTeamId = game.teams[0].id;
  const [selectedTeamId, setSelectedTeamId] = useState<number>(firstTeamId);
  const selectedTeam = game.teams.find(({ id }) => id === selectedTeamId);
  if (!selectedTeam) return <></>;
  return (
    <>
      <Header />
      <Teams
        selectedTeamId={selectedTeamId}
        setSelectedTeamId={setSelectedTeamId}
      />
      <TeamDetails team={selectedTeam} />
    </>
  );
}

function TeamDetails({ team }: { team: ITeamWithPlayers }) {
  return (
    <PlayBox mt={4}>
      <Typography
        display="flex"
        justifyContent="center"
        variant="h5"
      >{`Détails ${team.name}`}</Typography>
      <Grid container>
        <Grid item xs={6}>
          <PlayerList team={team} />
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    </PlayBox>
  );
}

function Header() {
  const { game } = usePlay();
  return (
    <PlayBox>
      <Grid container>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <GameStepper step={game.step} typographyProps={{ variant: "h5" }} />
        </Grid>
        <Grid item xs={3} />
      </Grid>
    </PlayBox>
  );
}

function Teams({
  selectedTeamId,
  setSelectedTeamId,
}: {
  selectedTeamId: number;
  setSelectedTeamId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { game } = usePlay();
  const theme = useTheme();
  return (
    <Grid container justifyContent="space-between" mt={4}>
      {game.teams.map((team) => {
        const color =
          team.id === selectedTeamId ? theme.palette.secondary.main : "white";
        return (
          <Grid
            key={team.id}
            item
            onClick={() => setSelectedTeamId(team.id)}
            sx={{ cursor: "pointer" }}
            xs={2}
          >
            <PlayBox borderColor={color} color={color}>
              <Typography textAlign="center" variant="h5">
                {team.name}
              </Typography>
              <Players teamWithPlayers={team} />
            </PlayBox>
          </Grid>
        );
      })}
    </Grid>
  );
}

function Players({ teamWithPlayers }: { teamWithPlayers: ITeamWithPlayers }) {
  return (
    <Box display="flex" minHeight="24px">
      {teamWithPlayers.players.map(({ user }) => {
        return (
          <Tooltip key={user.id} title={`${user.firstName} ${user.lastName}`}>
            <PersonIcon />
          </Tooltip>
        );
      })}
    </Box>
  );
}
