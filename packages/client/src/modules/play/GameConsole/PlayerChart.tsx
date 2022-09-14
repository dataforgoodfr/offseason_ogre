import { Box } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { StackedEnergyBars } from "../../charts/StackedEnergyBars";
import { sumFor } from "../../persona";
import { usePersonaByUserId, usePlay } from "../context/playContext";
import { getLastCompletedStepPlayerValues } from "../utils/playerValues";

export { PlayerChart };

function PlayerChart({
  team,
  displayLatestProductionData = false,
}: {
  team: ITeamWithPlayers;
  displayLatestProductionData?: boolean;
}) {
  const data = useBuildData({ team, displayLatestProductionData });
  return (
    <Box>
      <StackedEnergyBars data={data} />
    </Box>
  );
}

function useBuildData({
  team,
  displayLatestProductionData,
}: {
  team: ITeamWithPlayers;
  displayLatestProductionData: boolean;
}) {
  const { game } = usePlay();
  const userIds = team.players.map(({ user }) => user.id);
  const personaByUserId = usePersonaByUserId(userIds);
  const [firstPersona] = Object.values(personaByUserId); // TODO: I am not sure how production should be computed. Sum for all team members?

  const personaForProduction = displayLatestProductionData
    ? firstPersona.latestPersona
    : firstPersona.currentPersona;

  return [
    ...team.players.map((player) => {
      const userId = player.user.id;
      const personaBySteps = personaByUserId[userId]!.personaBySteps;
      const playerConsumption = getLastCompletedStepPlayerValues(
        game,
        personaBySteps
      ).consumption;
      return {
        name: buildName(player.user),
        fossil: sumFor(playerConsumption, "fossil"),
        grey: sumFor(playerConsumption, "grey"),
        mixte: sumFor(playerConsumption, "mixte"),
        renewable: sumFor(playerConsumption, "renewable"),
      };
    }),
    personaForProduction
      ? {
          name: "Production",
          offshore: sumFor(personaForProduction.production, "offshore"),
          // nuclear: sumFor(personaForProduction.production, "nuclear"),
          terrestrial: sumFor(personaForProduction.production, "terrestrial"),
        }
      : {
          name: "Production",
          offshore: 0,
          // nuclear: 0,
          terrestrial: 0,
        },
  ];
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
