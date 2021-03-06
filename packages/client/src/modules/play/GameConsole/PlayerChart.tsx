import { Box } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { StackedEnergyBars } from "../../charts/StackedEnergyBars";
import { sumFor } from "../../persona";
import { usePersonaByUserId } from "../context/playContext";

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
  const userIds = team.players.map(({ user }) => user.id);
  const personaByUserId = usePersonaByUserId({ userIds });
  const [firstPersona] = Object.values(personaByUserId); // TODO: I am not sure how production should be computed. Sum for all team members?
  return [
    ...team.players.map((player) => {
      const userId = player.user.id;
      const playerPersona = personaByUserId[userId];
      return {
        name: buildName(player.user),
        fossil: sumFor(playerPersona.consumption, "fossil"),
        grey: sumFor(playerPersona.consumption, "grey"),
        mixte: sumFor(playerPersona.consumption, "mixte"),
        renewable: sumFor(playerPersona.consumption, "renewable"),
      };
    }),
    firstPersona
      ? {
          name: "Production",
          hydroProduction: sumFor(firstPersona.production, "hydroProduction"),
          nuclear: sumFor(firstPersona.production, "nuclear"),
          terrestrialProduction: sumFor(
            firstPersona.production,
            "terrestrialProduction"
          ),
        }
      : {
          name: "Production",
          hydroProduction: 0,
          nuclear: 0,
          terrestrialProduction: 0,
        },
  ];
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
