import { Box, Card, useTheme } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ITeamWithPlayers, IUser } from "../../../utils/types";

export { PlayerChart };

function PlayerChart({ team }: { team: ITeamWithPlayers }) {
  const theme = useTheme();
  return (
    <Box p={2} pl={4}>
      <Card
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          pt: 4,
          pb: 4,
          pr: 2,
          pl: 2,
        }}
      >
        <BarChart width={500} height={500} data={buildData({ team })}>
          <XAxis dataKey="name" />
          <YAxis name="kWh/j" domain={[0, 300]} />
          <Tooltip />
          <Legend />
          <Bar
            barSize={25}
            dataKey="renewableEnergy"
            fill={theme.palette.energy.renewable}
            name={translateLabel("renewableEnergy")}
            stackId="a"
            unit="kWh"
          />
          <Bar
            dataKey="mixteEnergy"
            fill={theme.palette.energy.mixte}
            name={translateLabel("mixteEnergy")}
            stackId="a"
            unit="kWh"
          />
          <Bar
            dataKey="fossilEnergy"
            fill={theme.palette.energy.fossile}
            stackId="a"
            name={translateLabel("fossilEnergy")}
            unit="kWh"
          />
          <Bar
            dataKey="offshoreProduction"
            fill={theme.palette.production.offshore}
            barSize={25}
            name={translateLabel("offshoreProduction")}
            stackId="a"
            unit="kWh"
          />
          <Bar
            dataKey="terrestrialProduction"
            stackId="a"
            fill={theme.palette.production.terrestrial}
            barSize={25}
            name={translateLabel("terrestrialProduction")}
            unit="kWh"
          />
          <Bar
            dataKey="greyEnergy"
            stackId="a"
            fill={theme.palette.energy.grey}
            unit="kWh"
            name={translateLabel("greyEnergy")}
          />
        </BarChart>
      </Card>
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

function translateLabel(value: string): string {
  const translations = {
    fossilEnergy: "Energie fossile",
    greyEnergy: "Energie grise",
    renewableEnergy: "Energie renouvelable",
    mixteEnergy: "Energie mixte",
    offshoreProduction: "Production offshore",
    terrestrialProduction: "Production terrestre",
  } as Record<string, string>;
  return translations[value] ?? "Unkown";
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
