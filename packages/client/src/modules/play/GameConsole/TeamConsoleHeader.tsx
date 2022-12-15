import { Box, Grid, Tooltip, useTheme } from "@mui/material";
import { ITeamWithPlayers } from "../../../utils/types";
import { PlayBox } from "../Components";
import { useCurrentStep, usePlay } from "../context/playContext";
import { Icon } from "../../common/components/Icon";
import { Typography } from "../../common/components/Typography";
import { getTeamActionsAtCurrentStep } from "../utils/teamActions";

export { TeamConsoleHeader };

function TeamConsoleHeader({
  selectedTeamId,
  setSelectedTeamId,
}: {
  selectedTeamId: number;
  setSelectedTeamId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { game } = usePlay();
  const currentStep = useCurrentStep();

  const isProductionStep = currentStep?.type === "production";
  const isSynthesisStep = currentStep?.id === "final-situation";

  return (
    <Grid container justifyContent="space-around" mt={2}>
      {game.teams.map((team) => {
        return (
          <Grid
            key={team.id}
            item
            onClick={() => setSelectedTeamId(team.id)}
            sx={{ cursor: "pointer" }}
            xs={2}
          >
            {isSynthesisStep ? (
              <TeamSynthesis
                team={team}
                isSelected={team.id === selectedTeamId}
              />
            ) : isProductionStep ? (
              <TeamProduction
                team={team}
                isSelected={team.id === selectedTeamId}
              />
            ) : (
              <TeamConsumption
                team={team}
                isSelected={team.id === selectedTeamId}
              />
            )}
          </Grid>
        );
      })}
    </Grid>
  );
}

function TeamProduction({
  team,
  isSelected,
}: {
  team: ITeamWithPlayers;
  isSelected: boolean;
}) {
  const { game } = usePlay();
  const theme = useTheme();

  const teamActionsAtCurrentStep = getTeamActionsAtCurrentStep(
    game.step,
    team.actions
  );

  const teamActionCount = teamActionsAtCurrentStep.length;
  const touchedTeamActionsCount = teamActionsAtCurrentStep.filter(
    (teamAction) => teamAction.isTouched
  ).length;
  const hasFinishedStep = teamActionCount === touchedTeamActionsCount;

  const borderColor = isSelected ? theme.palette.secondary.main : "white";
  const textColor =
    isSelected || hasFinishedStep ? theme.palette.secondary.main : "white";

  return (
    <PlayBox
      display="flex"
      flexDirection="column"
      borderColor={borderColor}
      color={textColor}
      gap={1}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        minHeight="24px"
      >
        {hasFinishedStep ? (
          <Icon name="check-circle" sx={{ width: 18 }} />
        ) : (
          <Icon name="mark-circle" sx={{ width: 18 }} />
        )}
        <Typography textAlign="center" variant="h5">
          {team.name}
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        minHeight="24px"
      >
        <Icon name="team" />
        <Typography>
          {touchedTeamActionsCount}/{teamActionCount}
        </Typography>
      </Box>
    </PlayBox>
  );
}

function TeamConsumption({
  team,
  isSelected,
}: {
  team: ITeamWithPlayers;
  isSelected: boolean;
}) {
  const theme = useTheme();

  const color = isSelected ? theme.palette.secondary.main : "white";

  return (
    <PlayBox borderColor={color} color={color}>
      <Typography textAlign="center" variant="h5">
        {team.name}
      </Typography>

      <Box display="flex" minHeight="24px">
        {team.players.map(({ user, hasFinishedStep }) => {
          return (
            <Tooltip key={user.id} title={`${user.firstName} ${user.lastName}`}>
              <div>
                {hasFinishedStep ? (
                  <Icon
                    name="player-finished"
                    sx={{ color: theme.palette.secondary.main }}
                  />
                ) : (
                  <Icon name="player" sx={{ color: "white" }} />
                )}
              </div>
            </Tooltip>
          );
        })}
      </Box>
    </PlayBox>
  );
}

function TeamSynthesis({
  team,
  isSelected,
}: {
  team: ITeamWithPlayers;
  isSelected: boolean;
}) {
  const theme = useTheme();

  const hasScenarioName = !!team.scenarioName;

  const borderColor = isSelected ? theme.palette.secondary.main : "white";
  const textColor =
    isSelected || hasScenarioName ? theme.palette.secondary.main : "white";

  return (
    <PlayBox
      display="flex"
      flexDirection="column"
      borderColor={borderColor}
      color={textColor}
      gap={1}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        minHeight="24px"
      >
        {hasScenarioName ? (
          <Icon name="check-circle" sx={{ width: 18 }} />
        ) : (
          <Icon name="mark-circle" sx={{ width: 18 }} />
        )}
        <Typography textAlign="center" variant="h5">
          {team.name}
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        minHeight="24px"
      >
        <Icon name="team" />
        <Typography>{hasScenarioName ? 1 : 0}/1</Typography>
      </Box>
    </PlayBox>
  );
}
