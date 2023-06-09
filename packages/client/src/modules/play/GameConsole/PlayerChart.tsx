import { ITeam } from "../../../utils/types";
import { StackedEnergyBars } from "../../charts/StackedEnergyBars";
import { sumAllValues, sumForAndFormat } from "../../persona";
import { usePersonaByUserId, usePlay } from "../context/playContext";
import { Tabs } from "../../common/components/Tabs";
import { useMemo } from "react";
import {
  ResourcesPerProductionTypeChart,
  ResourcesPerStepChart,
} from "../../charts";
import { useTranslation } from "../../translations/useTranslation";

export { PlayerChart };

function PlayerChart({ team }: { team: ITeam }) {
  const { t } = useTranslation();
  const { players } = usePlay();

  const userIds = useMemo(
    () => players.filter((p) => p.teamId === team.id).map((p) => p.userId),
    [players, team]
  );
  const personaByUserId = usePersonaByUserId(userIds);
  const [firstPersona] = Object.values(personaByUserId);

  const data = useBuildData({ team });
  const consProdData = data.filter((data) =>
    ["consumption", "production"].includes(data.type)
  );

  const tabs = useMemo(() => {
    return [
      {
        label: t("page.teacher.statistics.tabs.energy-balance.label"),
        component: <StackedEnergyBars data={consProdData} tick={false} />,
      },
      {
        label: t("page.teacher.statistics.tabs.materials.label"),
        component: (
          <>
            <ResourcesPerStepChart
              getPersonaAtStep={firstPersona.getPersonaAtStep}
              resourceType="materials"
            />
            <ResourcesPerProductionTypeChart
              persona={firstPersona.currentPersona}
              resourceType="materials"
            />
          </>
        ),
      },
      {
        label: t("page.teacher.statistics.tabs.metals.label"),
        component: (
          <>
            <ResourcesPerStepChart
              getPersonaAtStep={firstPersona.getPersonaAtStep}
              resourceType="metals"
            />
            <ResourcesPerProductionTypeChart
              persona={firstPersona.currentPersona}
              resourceType="metals"
            />
          </>
        ),
      },
    ];
  }, [consProdData, firstPersona, t]);

  return <Tabs tabs={tabs} />;
}

function useBuildData({ team }: { team: ITeam }) {
  const { game, players } = usePlay();

  const playersInTeam = useMemo(
    () => players.filter((p) => p.teamId === team.id),
    [players, team]
  );
  const userIds = useMemo(
    () => playersInTeam.map((p) => p.userId),
    [playersInTeam]
  );
  const personaByUserId = usePersonaByUserId(userIds);
  const [firstPersona] = Object.values(personaByUserId);

  return [
    ...playersInTeam.map((player) => {
      const userId = player.userId;
      const personaBySteps = personaByUserId[userId]!.personaBySteps;
      const playerConsumption =
        personaBySteps[game.lastFinishedStep].consumption;

      return {
        name: buildName(player.user),
        type: "consumption",
        total: sumAllValues(playerConsumption) || 0,
        grey: sumForAndFormat(playerConsumption, "grey"),
        mixte: sumForAndFormat(playerConsumption, "mixte"),
        fossil: sumForAndFormat(playerConsumption, "fossil"),
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
  ];
}

function buildName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`;
}
