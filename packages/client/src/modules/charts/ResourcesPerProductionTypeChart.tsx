import React, { useMemo } from "react";
import {
  StackedBars,
  StackedBarsStackData,
  StackedBarsStacks,
} from "./StackedBars";
import { Persona } from "../persona/persona";
import { PhysicalResourceNeedDatum } from "../play/gameEngines/resourcesEngine";
import { pipe } from "../../lib/fp";
import { ProductionTypes } from "../../utils/types";
import _ from "lodash";
import { useTranslation } from "../translations/useTranslation";
import { formatResource } from "../../lib/formatter";
import { buildLabel } from "./utils/labels";

export { ResourcesPerProductionTypeChart };

function ResourcesPerProductionTypeChart({
  persona,
  resourceType,
}: {
  persona: Persona;
  resourceType: "materials" | "metals";
}) {
  const { t } = useTranslation();

  const graphStacks: StackedBarsStacks = useMemo(() => {
    const data: StackedBarsStackData[] = pipe(
      persona[`${resourceType}Displayed`],
      (resources: PhysicalResourceNeedDatum[]) =>
        resources.reduce(
          (
            resourcesIndexedByProdType: Record<
              ProductionTypes,
              PhysicalResourceNeedDatum[]
            >,
            datum
          ) => {
            if (!resourcesIndexedByProdType[datum.type]) {
              resourcesIndexedByProdType[datum.type] = [];
            }
            resourcesIndexedByProdType[datum.type].push(datum);
            return resourcesIndexedByProdType;
          },
          {} as Record<ProductionTypes, PhysicalResourceNeedDatum[]>
        ),
      Object.entries as any,
      (entries: [ProductionTypes, PhysicalResourceNeedDatum[]][]) =>
        _.sortBy(entries, (entry) => entry[0]),
      (entries) =>
        entries.map(([prodType, resources]) => ({
          label: t(`graph.materials.${prodType}`),
          total: _.sumBy(resources, "value"),
          bars: resources.map((datum) => ({
            key: datum.name,
            label: buildLabel(resourceType, datum.name),
            total: datum.value,
          })),
        }))
    );

    return {
      data,
      yAxisUnitLabel: t("unit.tonne.kilo"),
      palettes: resourceType,
      yAxisValueFormatter: formatResource(),
      yAxisTicksValueFormatter: formatResource({ fractionDigits: 0 }),
    };
  }, [persona, resourceType, t]);

  return (
    <StackedBars
      title={t(
        `graph.${resourceType}.quantity-per-production-type-graph.title`
      )}
      direction="vertical"
      stacks={graphStacks}
    />
  );
}
