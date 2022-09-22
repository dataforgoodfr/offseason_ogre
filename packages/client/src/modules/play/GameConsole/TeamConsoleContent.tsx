import { Box, Rating, useTheme } from "@mui/material";
import { PlayerChart } from "./PlayerChart";
import { PlayBox } from "../Components";
import { Icon } from "../../common/components/Icon";
import { ITeamWithPlayers, IUser, Player } from "../../../utils/types";
import {
  usePersonaByUserId,
  useCurrentStep,
  usePlay,
} from "../context/playContext";
import { Typography } from "../../common/components/Typography";
import { formatBudget, formatCarbonFootprint } from "../../../lib/formatter";
import { TeamActionsRecap } from "../Components/TeamActionsRecap";
import { getTeamActionsAtCurrentStep } from "../utils/teamActions";

export { TeamConsoleContent };

function TeamConsoleContent({ team }: { team: ITeamWithPlayers }) {
  const { game } = usePlay();
  const currentStep = useCurrentStep();

  const isProductionStep = currentStep?.type === "production";

  const teamActionsAtCurrentStep = getTeamActionsAtCurrentStep(
    game.step,
    team.actions
  );
  const PlayerComponent = isProductionStep
    ? PlayerProduction
    : PlayerConsumption;

  return (
    <PlayBox display="flex" flexDirection="column" gap={3} mt={2} pt={3}>
      <Typography
        display="flex"
        justifyContent="center"
        variant="h4"
      >{`Détails ${team.name}`}</Typography>

      <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr">
        <Box display="flex" flexDirection="column" gap={2}>
          {team.players.map((player) => (
            <PlayerComponent key={player.user.id} player={player} />
          ))}
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          {isProductionStep && (
            <PlayBox>
              <TeamActionsRecap
                title="Actions Production"
                teamActions={teamActionsAtCurrentStep}
              />
            </PlayBox>
          )}
          <PlayerChart team={team} />
        </Box>
      </Box>
    </PlayBox>
  );
}

function PlayerProduction({ player }: { player: Player }) {
  const { latestPersona, currentPersona } = usePersonaByUserId(player.userId);

  return (
    <PlayBox key={player.userId}>
      <Box display="flex" alignItems="center">
        <Typography variant="h5">{buildName(player.user)}</Typography>
      </Box>

      <Box display="flex" alignItems="center" mt={2}>
        <Icon name="budget" />
        <Typography ml={1} width={150}>
          Budget restant :
        </Typography>
        <Typography>{formatBudget(latestPersona.budget)} €/j</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Icon name="carbon-footprint" />
        <Typography ml={1} width={150}>
          Bilan carbone :
        </Typography>
        <Typography>
          {formatCarbonFootprint(currentPersona.carbonFootprint)} kgCO2/j
        </Typography>
      </Box>
    </PlayBox>
  );
}

function PlayerConsumption({ player }: { player: Player }) {
  const currentStep = useCurrentStep();
  const theme = useTheme();

  const { latestPersona, currentPersona } = usePersonaByUserId(player.userId);

  return (
    <PlayBox key={player.userId}>
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
        <Typography>{formatBudget(latestPersona.budget)} €/j</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Icon name="carbon-footprint" />
        <Typography ml={1} width={150}>
          Bilan carbone :
        </Typography>
        <Typography>
          {formatCarbonFootprint(currentPersona.carbonFootprint)} kgCO2/j
        </Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Icon name="action-points" />
        <Typography ml={1} width={150}>
          Point d'actions :
        </Typography>
        <Rating
          emptyIcon={
            <Icon
              name="star"
              style={{ fill: "grey", opacity: 0.5 }}
              fontSize="inherit"
            />
          }
          max={currentStep?.availableActionPoints}
          name="action-points"
          readOnly
          value={latestPersona.actionPoints}
        />
      </Box>
    </PlayBox>
  );
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
