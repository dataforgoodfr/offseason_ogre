import { Box, Rating, Typography, useTheme } from "@mui/material";
import { ITeamWithPlayers, IUser, Player } from "../../../utils/types";
import { PlayBox } from "../Components";
import StarIcon from "@mui/icons-material/Star";
import { MAX_ACTION_POINTS } from "../constants";
import { GameStep, MAX_NUMBER_STEPS, STEPS } from "../constants";
import {
  useCurrentPersona,
  usePlay,
  useResultsByUserId,
  usePlayerActions,
} from "../context/playContext";
import { persona } from "../../persona/persona";
import { PlayerActions } from "../../../utils/types";
import { getLastCompletedStepPlayerValues } from "../utils/playerValues";
import { Icon } from "../../common/components/Icon";

import { io, Socket } from "socket.io-client";

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

function PlayerMini({ player }: { player: Player }) {
  const { game } = usePlay();
  const persona = useCurrentPersona();
  const theme = useTheme();

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
      <Box display="flex" alignItems="center">
        <Typography variant="h5">{buildName(player.user)}</Typography>
        {player.hasFinishedStep ? (
          <Icon
            name="player-finished"
            sx={{ ml: 1, color: theme.palette.secondary.main }}
          />
        ) : null}
      </Box>

      <Box display="flex" alignItems="center" mt={2}>
        <Icon name="budget" />
        <Typography ml={1} width={150}>
          Budget restant :
        </Typography>
        <Typography>{userData.budget} €/j</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Icon name="carbon-footprint" />
        <Typography ml={1} width={150}>
          Bilan carbone :
        </Typography>
        <Typography>{userData.carbonFootprint} kgCO2/an</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Icon name="action-points" />
        <Typography ml={1} width={150}>
          Point d'actions :
        </Typography>
        <Rating
          emptyIcon={
            <StarIcon
              style={{ fill: "grey", opacity: 0.5 }}
              fontSize="inherit"
            />
          }
          max={MAX_ACTION_POINTS}
          name="action-points"
          readOnly
          value={persona.points}
        />
      </Box>
    </PlayBox>
  );
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
