import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  StackedBars,
  StackedBarsBar,
  StackedBarsLine,
  StackedBarsStackData,
  StackedBarsStacks,
} from "./StackedBars";
import { Persona } from "../persona/persona";
import { MaterialsType } from "../../utils/types";
import { pipe } from "../../lib/fp";
import { STEPS } from "../play";
import _ from "lodash";
import { formatMaterial } from "../../lib/formatter";
import { ENERGY_SHIFT_TARGET_YEAR } from "../common/constants";
import { usePlay } from "../play/context/playContext";

export { MaterialsPerStepChart };

function MaterialsPerStepChart({
  getPersonaAtStep,
}: {
  getPersonaAtStep: (step: number) => Persona;
}) {
  const { t } = useTranslation();
  const { game } = usePlay();

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

    return [
      {
        data,
        key: "total",
        label: t("graph.common.production"),
        yAxisUnitLabel: t("unit.watthour-per-day.kilo"),
        palettes: "production",
        useLinesAxis: true,
        yAxisValueFormatter: (value) => value?.toFixed(2),
      } as StackedBarsLine,
    ];
  }, [game.lastFinishedStep, getPersonaAtStep, t]);

  return (
    <StackedBars
      title={t("graph.materials.quantity-per-step-graph.title", {
        year: ENERGY_SHIFT_TARGET_YEAR,
      })}
      stacks={graphStacks}
      lines={graphLines}
    />
  );
}
