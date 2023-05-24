import React, { useMemo, useState } from "react";
import {
  StackedEnergyBars,
  DetailsEnergyConsumptionBars,
  DetailsEnergyProductionBars,
  ResourcesPerProductionTypeChart,
  ResourcesPerStepChart,
} from "../../charts";
import { PlayBox } from "../Components";
import {
  EnergyConsumptionButtons,
  EnergyProductionButtons,
} from "../../common/components/EnergyButtons";
import { STEPS } from "../constants";
import _ from "lodash";
import { usePersona, usePlay } from "../context/playContext";
import { sumAllValues, sumForAndFormat } from "../../persona";
import { IGame } from "../../../utils/types";
import { Tabs } from "../../common/components/Tabs";
import { useTranslation } from "../../translations/useTranslation";

export { StatsGraphs };

function isNotFinishedStep(step: number, game: IGame) {
  return step > game.lastFinishedStep;
}

function StatsGraphs() {
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    return [
      {
        label: t("page.player.statistics.tabs.energy-balance.label"),
        component: <ConsumptionAndProductionGraph />,
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
  }, [t]);

  return (
    <PlayBox>
      <Tabs tabs={tabs} />
    </PlayBox>
  );
}

function ConsumptionAndProductionGraph() {
  const [selectedBarIdx, setSelectedBarIdx] = useState<number>();
  const { game } = usePlay();
  const { personaBySteps, getPersonaAtStep } = usePersona();

  const bars = useMemo(() => {
    const initialPersona = getPersonaAtStep(0);
    const initialValues = [
      {
        name: "Conso init",
        total: sumAllValues(initialPersona.consumption) || 0,
        grey: sumForAndFormat(initialPersona.consumption, "grey"),
        mixte: sumForAndFormat(initialPersona.consumption, "mixte"),
        fossil: sumForAndFormat(initialPersona.consumption, "fossil"),
        renewable: sumForAndFormat(initialPersona.consumption, "renewable"),
      },
      {
        name: "Prod init",
        total: sumAllValues(initialPersona.production) || 0,
        offshore: sumForAndFormat(initialPersona.production, "offshore"),
        nuclear: sumForAndFormat(initialPersona.production, "nuclear"),
        terrestrial: sumForAndFormat(initialPersona.production, "terrestrial"),
      },
    ];

    const stepsDetails = _.range(1, game.lastFinishedStep + 1).map(
      (step: number) => {
        const persona = personaBySteps[step];
        if (STEPS[step]?.type === "consumption") {
          return {
            name: step ? `Étape ${step}` : "Initial",
            total: sumAllValues(persona.consumption) || 0,
            grey: sumForAndFormat(persona.consumption, "grey"),
            mixte: sumForAndFormat(persona.consumption, "mixte"),
            fossil: sumForAndFormat(persona.consumption, "fossil"),
            renewable: sumForAndFormat(persona.consumption, "renewable"),
          };
        } else {
          return {
            name: step ? `Étape ${step}` : "Initial",
            total: sumAllValues(persona.production) || 0,
            offshore: sumForAndFormat(persona.production, "offshore"),
            nuclear: sumForAndFormat(persona.production, "nuclear"),
            terrestrial: sumForAndFormat(persona.production, "terrestrial"),
          };
        }
      }
    );

    return [...initialValues, ...stepsDetails];
  }, [game.lastFinishedStep, personaBySteps, getPersonaAtStep]);

  return (
    <>
      <StackedEnergyBars
        data={bars}
        onClick={({ activeTooltipIndex }) => {
          setSelectedBarIdx(activeTooltipIndex);
        }}
      />
      {
        <ConsumptionAndProductionDetailsGraph
          barIdx={selectedBarIdx}
          bar={bars[selectedBarIdx ?? -1]}
        />
      }
    </>
  );
}

function ConsumptionAndProductionDetailsGraph({
  barIdx,
  bar,
}: {
  barIdx: number | undefined;
  bar?: { name: string };
}) {
  const { t } = useTranslation();
  const { game } = usePlay();
  const { getPersonaAtStep } = usePersona();

  const graphTitle = useMemo(() => {
    if (bar) {
      return t(
        "page.player.statistics.tabs.energy-balance.graphs.details.title",
        { stackName: bar.name }
      );
    }
    return "";
  }, [bar, t]);

  if (typeof barIdx === "undefined") return <></>;

  const step = Math.max(barIdx - 1, 0);
  if (isNotFinishedStep(step, game)) return <></>;

  const persona = getPersonaAtStep(step);

  return (
    <>
      {step === 0 && barIdx === 0 ? (
        <>
          <DetailsEnergyConsumptionBars title={graphTitle} persona={persona} />
          <EnergyConsumptionButtons persona={persona} />
        </>
      ) : step === 0 && barIdx === 1 ? (
        <>
          <DetailsEnergyProductionBars title={graphTitle} persona={persona} />
          <EnergyProductionButtons persona={persona} />
        </>
      ) : STEPS[step]?.type === "consumption" ? (
        <>
          <DetailsEnergyConsumptionBars title={graphTitle} persona={persona} />
          <EnergyConsumptionButtons persona={persona} />
        </>
      ) : (
        <>
          <DetailsEnergyProductionBars title={graphTitle} persona={persona} />
          <EnergyProductionButtons persona={persona} />
        </>
      )}
    </>
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
