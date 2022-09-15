import { Box } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { StackedEnergyBars } from "../../charts/StackedEnergyBars";
import { sumFor } from "../../persona";
import { usePersonaByUserId, usePlay } from "../context/playContext";
import { getLastCompletedStepPlayerValues } from "../utils/playerValues";

export { PlayerChart };

function PlayerChart({ team }: { team: ITeamWithPlayers }) {
  const data = useBuildData({ team });
  return (
    <Box>
      <StackedEnergyBars data={data} />
    </Box>
  );
}

function useBuildData({ team }: { team: ITeamWithPlayers }) {
  const { game } = usePlay();
  const userIds = team.players.map(({ user }) => user.id);
  const personaByUserId = usePersonaByUserId(userIds);
  const [firstPersona] = Object.values(personaByUserId); // TODO: I am not sure how production should be computed. Sum for all team members?

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
    firstPersona
      ? {
          name: "Production",
          offshore: sumFor(firstPersona.currentPersona.production, "offshore"),
          // nuclear: sumFor(firstPersona.currentPersona.production, "nuclear"),
          terrestrial: sumFor(
            firstPersona.currentPersona.production,
            "terrestrial"
          ),
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
