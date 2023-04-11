import { Box } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { StackedEnergyBars } from "../../charts/StackedEnergyBars";
import { sumAllValues, sumForAndFormat } from "../../persona";
import { usePersonaByUserId, usePlay } from "../context/playContext";

export { PlayerChart };

function PlayerChart({ team }: { team: ITeamWithPlayers }) {
  const data = useBuildData({ team });
  return (
    <Box>
      <StackedEnergyBars data={data} tick={false} />
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
      const playerConsumption =
        personaBySteps[game.lastFinishedStep].consumption;

      return {
        name: buildName(player.user),
        total: sumAllValues(playerConsumption) || 0,
        fossil: sumForAndFormat(playerConsumption, "fossil"),
        grey: sumForAndFormat(playerConsumption, "grey"),
        mixte: sumForAndFormat(playerConsumption, "mixte"),
        renewable: sumForAndFormat(playerConsumption, "renewable"),
      };
    }),
    firstPersona
      ? {
          name: "Production",
          total: sumAllValues(firstPersona.currentPersona.production) || 0,
          offshore: sumForAndFormat(
            firstPersona.currentPersona.production,
            "offshore"
          ),
          nuclear: sumForAndFormat(
            firstPersona.currentPersona.production,
            "nuclear"
          ),
          terrestrial: sumForAndFormat(
            firstPersona.currentPersona.production,
            "terrestrial"
          ),
        }
      : {
          name: "Production",
          total: 0,
          offshore: 0,
          nuclear: 0,
          terrestrial: 0,
        },
  ];
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
