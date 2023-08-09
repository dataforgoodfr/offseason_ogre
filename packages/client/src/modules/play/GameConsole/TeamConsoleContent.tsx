import { Box, Rating, useTheme } from "@mui/material";
import { ReactNode, useMemo } from "react";
import { PlayerChart } from "./PlayerChart";
import { PlayBox } from "../Components";
import { Icon } from "../../common/components/Icon";
import { ITeam, Player } from "../../../utils/types";
import {
  usePersonaByUserId,
  useCurrentStep,
  usePlay,
} from "../context/playContext";
import { Typography } from "../../common/components/Typography";
import {
  formatBudget,
  formatCarbonFootprint,
  formatUserName,
} from "../../../lib/formatter";
import { TeamActionsRecap } from "../Components/TeamActionsRecap";
import { getTeamActionsAtCurrentStep } from "../utils/teamActions";
import { sumAllValues } from "../../persona";
import SynthesisRecapForTeacher from "../Components/Synthesis/SynthesisRecapForTeacher";

export { TeamConsoleContent };

function TeamConsoleContent({ team }: { team: ITeam }) {
  const currentStep = useCurrentStep();

  const isProductionStep = currentStep?.type === "production";
  const isSynthesisStep = currentStep?.id === "final-situation";

  if (isSynthesisStep) {
    return <TeamConsoleContentSynthesis team={team} />;
  } else if (isProductionStep) {
    return <TeamConsoleContentProduction team={team} />;
  } else {
    return <TeamConsoleContentConsumption team={team} />;
  }
}

function TeamConsoleContentConsumption({ team }: { team: ITeam }) {
  const { players } = usePlay();
  const playersInTeam = useMemo(
    () => players.filter((p) => p.teamId === team.id),
    [players, team]
  );

  return (
    <TeamConsoleContentLayout
      team={team}
      content={
        <>
          <Box display="grid" gap={2} gridTemplateColumns="1fr 2fr">
            <Box display="flex" flexDirection="column" gap={2}>
              {playersInTeam.map((player) => (
                <PlayerConsumption key={player.user.id} player={player} />
              ))}
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <PlayerChart team={team} />
              </Box>
            </Box>
          </Box>
        </>
      }
    />
  );
}

function TeamConsoleContentProduction({ team }: { team: ITeam }) {
  const { game, players, productionActionById } = usePlay();
  const playersInTeam = useMemo(
    () => players.filter((p) => p.teamId === team.id),
    [players, team]
  );

  const teamActionsAtCurrentStep = getTeamActionsAtCurrentStep(
    game.step,
    team.actions,
    productionActionById
  );

  return (
    <TeamConsoleContentLayout
      team={team}
      content={
        <>
          <Box display="grid" gap={2} gridTemplateColumns="1fr 2fr">
            <Box display="flex" flexDirection="column" gap={2}>
              {playersInTeam.map((player) => (
                <PlayerProduction key={player.user.id} player={player} />
              ))}
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <PlayBox>
                  <TeamActionsRecap
                    title="Actions Production"
                    teamActions={teamActionsAtCurrentStep}
                    showCredibility
                    showProductionValue
                  />
                </PlayBox>
              </Box>
              <Box>
                <PlayerChart team={team} />
              </Box>
            </Box>
          </Box>
        </>
      }
    />
  );
}

function TeamConsoleContentSynthesis({ team }: { team: ITeam }) {
  const { players } = usePlay();
  const playersInTeam = useMemo(
    () => players.filter((p) => p.teamId === team.id),
    [players, team]
  );

  return (
    <TeamConsoleContentLayout
      team={team}
      content={
        <>
          <PlayBox>
            <SynthesisRecapForTeacher team={team} />
          </PlayBox>

          <Box display="grid" gap={2} gridTemplateColumns="1fr 2fr">
            <Box display="flex" flexDirection="column" gap={2}>
              {playersInTeam.map((player) => (
                <PlayerSynthesis key={player.user.id} player={player} />
              ))}
            </Box>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <PlayerChart team={team} />
              </Box>
            </Box>
          </Box>
        </>
      }
    />
  );
}

function TeamConsoleContentLayout({
  team,
  content,
}: {
  team: ITeam;
  content: ReactNode;
}) {
  return (
    <PlayBox display="flex" flexDirection="column" gap={3} mt={2} pt={3}>
      <Typography
        sx={{ lineBreak: "anywhere" }}
        display="flex"
        justifyContent="center"
        variant="h4"
      >
        {`Détails ${team.name}`}{" "}
        {team.scenarioName ? ` - ${team.scenarioName}` : ""}
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        {content}
      </Box>
    </PlayBox>
  );
}

function PlayerSynthesis({ player }: { player: Player }) {
  const { latestPersona } = usePersonaByUserId(player.userId);

  return (
    <PlayBox key={player.userId}>
      <Box display="flex" alignItems="center">
        <Typography variant="h5">{formatUserName(player.user)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-evenly" alignItems="center">
        <Box
          display="flex"
          alignItems="center"
          sx={{ fontSize: "12px", fontWeight: "400", mt: 2 }}
        >
          <Icon name="carbon-footprint" sx={{ mr: 1 }} />
          <Box
            display="flex"
            alignItems="center"
            sx={{ fontSize: "12px", fontWeight: "400" }}
          >
            {formatCarbonFootprint(latestPersona.carbonFootprint || 0)} kg/j
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          sx={{ fontSize: "12px", fontWeight: "400", mt: 2 }}
        >
          <Icon name="production" sx={{ mr: 1 }} />
          <Box display="flex" alignItems="center">
            {sumAllValues(latestPersona.production) || 0} kWh/jour
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          sx={{ fontSize: "12px", fontWeight: "400", mt: 2 }}
        >
          <Icon name="consumption" sx={{ mr: 1 }} />
          <Box display="flex" alignItems="center">
            {sumAllValues(latestPersona.consumption) || 0} kWh/jour
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          sx={{ fontSize: "12px", fontWeight: "400", mt: 2 }}
        >
          <Icon name="budget" sx={{ mr: 1 }} />
          <Box display="flex" alignItems="center">
            {formatBudget(latestPersona.budget || 0)} €/j
          </Box>
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
        <Typography variant="h5">{formatUserName(player.user)}</Typography>
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
        <Typography variant="h5">{formatUserName(player.user)}</Typography>
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
      <Box display="flex" alignItems="top">
        <Icon name="action-points" />
        <Typography ml={1} width={150} sx={{ flexShrink: 0 }}>
          Point d'actions :
        </Typography>
        <Rating
          sx={{ flexWrap: "wrap" }}
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
