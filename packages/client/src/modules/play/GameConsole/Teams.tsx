import { Box, Grid, Tooltip, Typography, useTheme } from "@mui/material";
import { ITeamWithPlayers } from "../../../utils/types";
import { PlayerList } from "./PlayerList";
import { PlayerChart } from "./PlayerChart";
import { PlayBox } from "../Components";
import { usePlay } from "../context/playContext";
import { Icon } from "../../common/components/Icon";

export { TeamDetails, Teams };

function TeamDetails({ team }: { team: ITeamWithPlayers }) {
  return (
    <PlayBox mt={2}>
      <Typography
        display="flex"
        justifyContent="center"
        variant="h5"
      >{`Détails ${team.name}`}</Typography>
      <Grid container>
        <Grid item xs={6}>
          <PlayerList team={team} />
        </Grid>
        <Grid item xs={6}>
          <PlayerChart team={team} />
        </Grid>
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
    <Grid container justifyContent="space-between" mt={2}>
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
      {teamWithPlayers.players.map(({ user, hasFinishedStep }) => {
        return (
          <Tooltip key={user.id} title={`${user.firstName} ${user.lastName}`}>
            <div>
              {hasFinishedStep ? (
                <Icon name="player-finished" />
              ) : (
                <Icon name="player" />
              )}
            </div>
          </Tooltip>
        );
      })}
    </Box>
  );
}
