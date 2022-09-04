import { Box, Rating, Typography } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { PlayBox } from "../Components";
import PaidIcon from "@mui/icons-material/Paid";
import CloudIcon from "@mui/icons-material/Cloud";
import StarIcon from "@mui/icons-material/Star";
import { MAX_ACTION_POINTS } from "../constants";
import { GameStep, MAX_NUMBER_STEPS, STEPS } from "../constants";
import {
  // useCurrentPersona,
  usePlay,
  useResultsByUserId,
  // usePlayerActions,
} from "../context/playContext";
import { persona } from "../../persona/persona";
import { PlayerActions } from "../../../utils/types";
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
  actions: PlayerActions[];
}

function PlayerMini({ player }: { player: IPlayer }) {
  const { game } = usePlay();
  const results = useResultsByUserId({
    userIds: player ? [player.userId] : [],
  });
  const userData = player
    ? getLastCompletedStepPlayerValues(game, results[player.userId])
    : persona;
  const availableActionPoints = STEPS?.[game.step].availableActionPoints || 0;
  const playerActionsAtCurrentStep = player.actions.filter(
    (pa: PlayerActions) => pa.action.step === game.step
  );
  const actionPointsUsedAtCurrentStep = playerActionsAtCurrentStep.reduce(
    (sum: number, pa: PlayerActions) =>
      pa.isPerformed ? sum + pa.action.actionPointCost : sum,
    0
  );
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
      <ActionPoints
        actionPointsUsed={actionPointsUsedAtCurrentStep}
        maxActionPoints={availableActionPoints}
      />
    </PlayBox>
  );
}

function ActionPoints({
  actionPointsUsed,
  maxActionPoints,
}: {
  actionPointsUsed: number;
  maxActionPoints: number;
}) {
  return (
    <Box mt={2}>
      <Typography>Point d'actions</Typography>
      <Rating
        emptyIcon={
          <StarIcon style={{ fill: "grey", opacity: 0.5 }} fontSize="inherit" />
        }
        max={maxActionPoints}
        name="action-points"
        readOnly
        value={actionPointsUsed}
      />
    </Box>
  );
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
