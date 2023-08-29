import { ITeam } from "../../../utils/types";
import { usePersonaByUserId, usePlay } from "../context/playContext";
import { Tabs } from "../../common/components/Tabs";
import { useMemo } from "react";
import {
  EnergyBalanceForTeamChart,
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

  const tabs = useMemo(() => {
    return [
      {
        label: t("page.teacher.statistics.tabs.energy-balance.label"),
        component: <EnergyBalanceForTeamChart team={team} />,
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
  }, [firstPersona, team, t]);

  return <Tabs tabs={tabs} />;
}
