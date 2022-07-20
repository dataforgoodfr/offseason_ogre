import { Box, Rating, Typography } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { PlayBox } from "../Components";
import PaidIcon from "@mui/icons-material/Paid";
import CloudIcon from "@mui/icons-material/Cloud";
import StarIcon from "@mui/icons-material/Star";
import { MAX_ACTION_POINTS } from "../constants";
import { useCurrentPersona, usePlay, useResultsByUserId } from "../context/playContext";
import { persona } from "../../persona/persona";
import { getLastCompletedStepPlayerValues } from "../utils/playerValues";

export { PlayerList };

function PlayerList({ team }: { team: ITeamWithPlayers }) {
  return (
    <>
      {team.players.map((player) => (
        <PlayerMini key={player.user.id} player={player} />
      ))}
    </>
  );
}

interface IPlayer {
  gameId: number;
  teamId: number;
  userId: number;
  user: IUser;
}

function PlayerMini({ player }: { player: IPlayer }) {
  const { game } = usePlay();

  const results = useResultsByUserId({ game, userIds: player ? [player.userId] : [] });
  const userData = player ? getLastCompletedStepPlayerValues(game, results[player.userId]) : persona
  return (
    <PlayBox key={player.userId} mt={2}>
      <Typography variant="h5">{buildName(player.user)}</Typography>
      <Box display="flex" alignItems="center" mt={2}>
        <PaidIcon />
        <Typography
          ml={1}
        >{`Budget restant: ${userData.budget} €/j`}</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <CloudIcon />
        <Typography
          ml={1}
        >{`Bilan carbone: ${userData.carbonFootprint} kgCO2/an`}</Typography>
      </Box>
      <ActionPoints />
    </PlayBox>
  );
}

function ActionPoints() {
  const personna = useCurrentPersona();
  return (
    <Box mt={2}>
      <Typography>Point d'actions</Typography>
      <Rating
        emptyIcon={
          <StarIcon style={{ fill: "grey", opacity: 0.5 }} fontSize="inherit" />
        }
        max={MAX_ACTION_POINTS}
        name="action-points"
        readOnly
        value={personna.points}
      />
    </Box>
  );
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
