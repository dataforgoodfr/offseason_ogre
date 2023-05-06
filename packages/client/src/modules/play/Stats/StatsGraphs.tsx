import React, { useCallback, useMemo, useState } from "react";
import {
  StackedEnergyBars,
  DetailsEnergyConsumptionBars,
  DetailsEnergyProductionBars,
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
import { IGame, MaterialsType, ProductionTypes } from "../../../utils/types";
import { formatMaterial } from "../../../lib/formatter";
import { MaterialsDatum } from "../gameEngines/materialsEngine";
import { Tabs } from "../../common/components/Tabs";
import { useTranslation } from "react-i18next";
import {
  StackedBars,
  StackedBarsStackData,
  StackedBarsBar,
  StackedBarsStacks,
  StackedBarsLine,
} from "../../charts/StackedBars";
import { pipe } from "../../../lib/fp";
import { Persona } from "../../persona/persona";
import { ENERGY_SHIFT_TARGET_YEAR } from "../../common/constants";

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
        fossil: sumForAndFormat(initialPersona.consumption, "fossil"),
        grey: sumForAndFormat(initialPersona.consumption, "grey"),
        mixte: sumForAndFormat(initialPersona.consumption, "mixte"),
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
            fossil: sumForAndFormat(persona.consumption, "fossil"),
            grey: sumForAndFormat(persona.consumption, "grey"),
            mixte: sumForAndFormat(persona.consumption, "mixte"),
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
  const step = barIdx === 0 || barIdx === 1 ? 0 : barIdx - 1;

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
  return (
    <>
      <MaterialsPerStepGraph />
      <MaterialsPerProductionTypeGraph />
    </>
  );
}

function MaterialsPerStepGraph() {
  const { t } = useTranslation();
  const { game } = usePlay();
  const { getPersonaAtStep } = usePersona();

  const computeBarsForPersona = useCallback(
    (persona: Persona): StackedBarsBar[] => {
      const indexBarByMaterialName = (persona: Persona) =>
        persona.materials.reduce((barIndexedByMaterialName, materialDatum) => {
          if (!barIndexedByMaterialName[materialDatum.name]) {
            barIndexedByMaterialName[materialDatum.name] = {
              key: materialDatum.name,
              label: t(`graph.materials.${materialDatum.name}`),
              total: 0,
            };
          }

          barIndexedByMaterialName[materialDatum.name].total +=
            materialDatum.value;

          return barIndexedByMaterialName;
        }, {} as Record<MaterialsType, StackedBarsBar>);

      const sortBars = (
        barIndexedByMaterialName: Record<MaterialsType, StackedBarsBar>
      ) => {
        return Object.entries(barIndexedByMaterialName)
          .sort(([materialNameA], [materialNameB]) =>
            materialNameA.localeCompare(materialNameB)
          )
          .map(([_, bar]) => bar);
      };

      return pipe(persona, indexBarByMaterialName, sortBars);
    },
    [t]
  );

  const graphStacks: StackedBarsStacks = useMemo(() => {
    const data = _.range(1, game.lastFinishedStep + 1).map(
      (stepIdx): StackedBarsStackData => {
        const bars: StackedBarsBar[] = computeBarsForPersona(
          getPersonaAtStep(stepIdx)
        );
        const total = _.sumBy(bars, "total");
        return {
          label: t(`step.${STEPS[stepIdx].id}.name`),
          total,
          bars,
        };
      }
    );

    return {
      data,
      yAxisUnitLabel: t("unit.tonne.mega"),
      palettes: "materials",
      yAxisValueFormatter: formatMaterial,
    };
  }, [game.lastFinishedStep, computeBarsForPersona, getPersonaAtStep, t]);

  const graphLines: StackedBarsLine[] = useMemo(() => {
    const data = _.range(1, game.lastFinishedStep + 1).map((stepIdx) => {
      const persona = getPersonaAtStep(stepIdx);
      return _.sumBy(persona.production, "value");
    });

    const dataMax = Math.max(...data);
    const stackTotalMax = Math.max(
      ...graphStacks.data.map((stack) => stack.total)
    );
    const resizeFactor = stackTotalMax / dataMax;
    const resizeDatum = (datum: number) => datum * resizeFactor;

    return [
      {
        data: data.map(resizeDatum),
        key: "total",
        label: t("graph.common.production"),
        yAxisUnitLabel: t("unit.watthour-per-day.kilo"),
        palettes: "production",
        hideInTooltip: true,
        yAxisValueFormatter: (value) => value?.toFixed(2),
      } as StackedBarsLine,
    ];
  }, [game.lastFinishedStep, graphStacks, getPersonaAtStep, t]);

  return (
    <StackedBars
      title={t(
        "page.player.statistics.tabs.materials.graphs.quantity-per-step.title",
        { year: ENERGY_SHIFT_TARGET_YEAR }
      )}
      stacks={graphStacks}
      lines={graphLines}
    />
  );
}

function MaterialsPerProductionTypeGraph() {
  const { t } = useTranslation();
  const { currentPersona } = usePersona();

  const graphStacks: StackedBarsStacks = useMemo(() => {
    const data: StackedBarsStackData[] = pipe(
      currentPersona.materials,
      (materials: MaterialsDatum[]) => _.sortBy(materials, "name"),
      (materials: MaterialsDatum[]) =>
        materials.reduce(
          (
            materialsIndexedByProdType: Record<
              ProductionTypes,
              MaterialsDatum[]
            >,
            datum
          ) => {
            if (!materialsIndexedByProdType[datum.type]) {
              materialsIndexedByProdType[datum.type] = [];
            }
            materialsIndexedByProdType[datum.type].push(datum);
            return materialsIndexedByProdType;
          },
          {} as Record<ProductionTypes, MaterialsDatum[]>
        ),
      Object.entries as any,
      (entries: [ProductionTypes, MaterialsDatum[]][]) =>
        _.sortBy(entries, (entry) => entry[0]),
      (entries) =>
        entries.map(([prodType, materials]) => ({
          label: t(`graph.materials.${prodType}`),
          total: _.sumBy(materials, "value"),
          bars: materials.map((datum) => ({
            key: datum.name,
            label: t(`graph.materials.${datum.name}`),
            total: datum.value,
          })),
        }))
    );

    return {
      data,
      yAxisUnitLabel: t("unit.tonne.mega"),
      palettes: "materials",
      yAxisValueFormatter: formatMaterial,
    };
  }, [currentPersona, t]);

  return (
    <StackedBars
      title={t(
        "page.player.statistics.tabs.materials.graphs.quantity-per-production-type.title"
      )}
      direction="vertical"
      stacks={graphStacks}
    />
  );
}
