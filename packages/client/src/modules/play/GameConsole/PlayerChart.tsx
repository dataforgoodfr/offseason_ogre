import { Box } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { StackedEnergyBars } from "../../charts/StackedEnergyBars";
import { sumFor } from "../../persona";
import { useResultsByUserId, usePlay } from "../context/playContext";
import { getLastCompletedStepPlayerValues } from "../utils/playerValues";

export { PlayerChart };

function PlayerChart({ team }: { team: ITeamWithPlayers }) {
  const data = useBuildData({ team });
  return (
    <Box p={2} pl={4}>
      <StackedEnergyBars data={data} />
    </Box>
  );
}

function useBuildData({ team }: { team: ITeamWithPlayers }) {
  const { game } = usePlay();
  const userIds = team.players.map(({ user }) => user.id);
  const personaByUserId = useResultsByUserId({ userIds });
  const [firstPersona] = Object.values(personaByUserId); // TODO: I am not sure how production should be computed. Sum for all team members?
  return [
    ...team.players.map((player) => {
      const userId = player.user.id;
      const playerPersona = personaByUserId[userId];
      const playerConsumption = getLastCompletedStepPlayerValues(
        game,
        playerPersona
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
          offshore: sumFor(firstPersona[0].production, "offshore"),
          // nuclear: sumFor(firstPersona[0].production, "nuclear"),
          terrestrial: sumFor(firstPersona[0].production, "terrestrial"),
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
