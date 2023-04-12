import { Box } from "@mui/material";
import { formatMaterial } from "../../../lib/formatter";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { MaterialsBars } from "../../charts";
import { StackedEnergyBars } from "../../charts/StackedEnergyBars";
import { sumAllValues, sumForAndFormat } from "../../persona";
import { productionTypes } from "../constants";
import { usePersonaByUserId, usePlay } from "../context/playContext";
import { MaterialsDatum } from "../gameEngines/materialsEngine";

export { PlayerChart };

function PlayerChart({ team }: { team: ITeamWithPlayers }) {
  const data = useBuildData({ team });
  const consProdData = data.filter((data) =>
    ["consumption", "production"].includes(data.type)
  );
  const materialsData = data.filter((data) => data.type === "materials");
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr" }} gap={3}>
      <StackedEnergyBars data={consProdData} tick={false} />
      <MaterialsBars data={materialsData} tick={false} />
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
        type: "consumption",
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
          type: "production",
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
          type: "production",
          total: 0,
          offshore: 0,
          nuclear: 0,
          terrestrial: 0,
        },
    ...Object.values(productionTypes).map((prodType: string) => ({
      name: prodType,
      type: "materials",
      ...Object.assign(
        {},
        ...firstPersona?.currentPersona.materials
          .filter((mat: MaterialsDatum) => mat.type === prodType)
          .map((mat: MaterialsDatum) => ({
            [mat.name]: formatMaterial(mat.value) || 0,
          }))
      ),
    })),
  ];
}

function buildName(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
