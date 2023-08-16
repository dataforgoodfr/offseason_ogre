import { Box } from "@mui/material";
import React, { useMemo } from "react";
import {
  StackedBars,
  StackedBarsStackData,
  StackedBarsStacks,
} from "../StackedBars";
import { formatProduction, formatUserName } from "../../../lib/formatter";
import { usePersonaByUserId, usePlay } from "../../play/context/playContext";
import { useTranslation } from "../../translations/useTranslation";
import {
  computeConsumptionBarsForPersona,
  computeProductionBarsForPersona,
} from "./utils";
import { ITeam } from "../../../utils/types";
import { buildStack } from "../utils";

export { EnergyBalanceForTeamChart };

function EnergyBalanceForTeamChart({ team }: { team: ITeam }) {
  const { t } = useTranslation();
  const { players } = usePlay();

  const playersInTeam = useMemo(
    () => players.filter((p) => p.teamId === team.id),
    [players, team]
  );
  const userIds = useMemo(
    () => playersInTeam.map((p) => p.userId),
    [playersInTeam]
  );
  const personaByUserId = usePersonaByUserId(userIds);

  const Graph = useMemo(() => {
    const consumptionStacks: StackedBarsStackData[] = playersInTeam.map(
      (player) =>
        buildStack({
          bars: computeConsumptionBarsForPersona({
            persona: personaByUserId[player.userId].currentPersona,
            t,
          }),
          label: formatUserName(player.user),
        })
    );

    const productionStack: StackedBarsStackData = buildStack({
      bars: computeProductionBarsForPersona({
        persona: personaByUserId[playersInTeam[0].userId].currentPersona,
        t,
      }),
      label: t("graph.common.production"),
    });

    const data = [...consumptionStacks, productionStack];

    const stacks: StackedBarsStacks = {
      data,
      yAxisUnitLabel: t("unit.watthour-per-day-bare.kilo"),
      palettes: ["energy", "production"],
      yAxisValueFormatter: (value) =>
        formatProduction(value, { fractionDigits: 2 }),
      yAxisTicksValueFormatter: (value) =>
        formatProduction(value, { fractionDigits: 0 }),
    };

    return (
      <StackedBars
        title={t("graph.energy-balance-for-team-graph.title")}
        stacks={stacks}
      />
    );
  }, [personaByUserId, playersInTeam, t]);

  return <Box>{Graph}</Box>;
}
