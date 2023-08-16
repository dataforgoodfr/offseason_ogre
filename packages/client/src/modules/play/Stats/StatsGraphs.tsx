import { Box } from "@mui/material";
import React, { useMemo } from "react";
import {
  ResourcesPerProductionTypeChart,
  ResourcesPerStepChart,
  EnergyBalanceForPlayerChart,
} from "../../charts";
import { PlayBox } from "../Components";
import { Tabs } from "../../common/components/Tabs";
import { useTranslation } from "../../translations";
import { usePersona } from "../context/hooks/player";
import { Typography } from "../../common/components/Typography";

export { StatsGraphs };

function StatsGraphs() {
  const { t } = useTranslation();
  const { getPersonaAtStep } = usePersona();

  const tabs = useMemo(() => {
    return [
      {
        label: t("page.player.statistics.tabs.energy-balance.label"),
        component: (
          <EnergyBalanceForPlayerChart getPersonaAtStep={getPersonaAtStep} />
        ),
      },
      {
        label: t("page.player.statistics.tabs.materials.label"),
        component: <MaterialsGraphTab />,
      },
      {
        label: t("page.player.statistics.tabs.metals.label"),
        component: <MetalsGraphTab />,
      },
    ];
  }, [getPersonaAtStep, t]);

  return (
    <PlayBox>
      <Box display="flex" flexDirection="column" gap={3} paddingTop={2}>
        <Typography sx={{ textAlign: "center", mb: 2 }} variant="h3">
          {t("page.player.statistics.title")}
        </Typography>
        <Box>
          <Tabs tabs={tabs} />
        </Box>
      </Box>
    </PlayBox>
  );
}

function MaterialsGraphTab() {
  const { currentPersona, getPersonaAtStep } = usePersona();

  return (
    <>
      <ResourcesPerStepChart
        getPersonaAtStep={getPersonaAtStep}
        resourceType="materials"
      />
      <ResourcesPerProductionTypeChart
        persona={currentPersona}
        resourceType="materials"
      />
    </>
  );
}

function MetalsGraphTab() {
  const { currentPersona, getPersonaAtStep } = usePersona();

  return (
    <>
      <ResourcesPerStepChart
        getPersonaAtStep={getPersonaAtStep}
        resourceType="metals"
      />
      <ResourcesPerProductionTypeChart
        persona={currentPersona}
        resourceType="metals"
      />
    </>
  );
}
