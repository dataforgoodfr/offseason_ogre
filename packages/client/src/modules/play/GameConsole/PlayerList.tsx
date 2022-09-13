import { Box, Rating, Typography, useTheme } from "@mui/material";
import { ITeamWithPlayers, IUser, Player } from "../../../utils/types";
import { PlayBox } from "../Components";
import StarIcon from "@mui/icons-material/Star";
import { usePersonaByUserId, useCurrentStep } from "../context/playContext";
import { Icon } from "../../common/components/Icon";

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
  const currentStep = useCurrentStep();
  const theme = useTheme();

  const { latestPersona } = usePersonaByUserId(player.userId);

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
        <Typography>{latestPersona.budget} €/j</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Icon name="carbon-footprint" />
        <Typography ml={1} width={150}>
          Bilan carbone :
        </Typography>
        <Typography>{latestPersona.carbonFootprint} kgCO2/an</Typography>
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
          max={currentStep?.availableActionPoints}
          name="action-points"
          readOnly
          value={latestPersona.points}
        />
      </Box>
    </PlayBox>
  );
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
