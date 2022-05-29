import { Box } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { StackedEnergyBars } from "../../charts/StackedEnergyBars";

export { PlayerChart };

function PlayerChart({ team }: { team: ITeamWithPlayers }) {
  return (
    <Box p={2} pl={4}>
      <StackedEnergyBars data={buildData({ team })} />
    </Box>
  );
}

function buildData({ team }: { team: ITeamWithPlayers }) {
  return [
    ...team.players.map((player) => {
      return {
        name: buildName(player.user),
        renewableEnergy: 30,
        fossilEnergy: 57,
        mixteEnergy: 15,
        greyEnergy: 112,
      };
    }),
    {
      name: "Production",
      offshoreProduction: 4,
      terrestrialProduction: 10,
    },
  ];
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
