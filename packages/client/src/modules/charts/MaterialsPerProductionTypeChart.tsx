import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  StackedBars,
  StackedBarsStackData,
  StackedBarsStacks,
} from "./StackedBars";
import { Persona } from "../persona/persona";
import { MaterialsDatum } from "../play/gameEngines/materialsEngine";
import { pipe } from "../../lib/fp";
import { ProductionTypes } from "../../utils/types";
import { formatMaterial } from "../../lib/formatter";
import _ from "lodash";

export { MaterialsPerProductionTypeChart };

function MaterialsPerProductionTypeChart({ persona }: { persona: Persona }) {
  const { t } = useTranslation();

  const graphStacks: StackedBarsStacks = useMemo(() => {
    const data: StackedBarsStackData[] = pipe(
      persona.materials,
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
      yAxisUnitLabel: t("unit.tonne.kilo"),
      palettes: "materials",
      yAxisValueFormatter: formatMaterial(),
      yAxisTicksValueFormatter: formatMaterial({ fractionDigits: 0 }),
    };
  }, [persona, t]);

  return (
    <StackedBars
      title={t("graph.materials.quantity-per-production-type-graph.title")}
      direction="vertical"
      stacks={graphStacks}
    />
  );
}
