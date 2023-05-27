import React, { useCallback, useMemo, useState } from "react";
import {
  StackedBars,
  StackedBarsBar,
  StackedBarsLine,
  StackedBarsStackData,
  StackedBarsStacks,
} from "./StackedBars";
import { Persona } from "../persona/persona";
import { MaterialsType, MetalsType } from "../../utils/types";
import { pipe } from "../../lib/fp";
import { STEPS, isStepOfType } from "../play";
import _ from "lodash";
import { formatProduction, formatResource } from "../../lib/formatter";
import {
  ENERGY_SHIFT_TARGET_YEAR,
  MATERIALS_AND_METALS_INFO_CARD_URL,
} from "../common/constants";
import { usePlay } from "../play/context/playContext";
import { useTranslation } from "../translations/useTranslation";
import { buildLabel } from "./utils/labels";
import { Button, IconButton } from "@mui/material";
import { Dialog } from "../common/components/Dialog";
import { Icon } from "../common/components/Icon";

export { ResourcesPerStepChart };

function ResourcesPerStepChart({
  getPersonaAtStep,
  resourceType,
}: {
  getPersonaAtStep: (step: number) => Persona;
  resourceType: "materials" | "metals";
}) {
  const { t } = useTranslation();
  const { game } = usePlay();
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  const stepIdsToDisplay = useMemo(
    (): number[] =>
      _.range(0, game.lastFinishedStep + 1).filter((step) =>
        isStepOfType(step, "production")
      ),
    [game.lastFinishedStep]
  );

  const computeBarsForPersona = useCallback(
    (persona: Persona): StackedBarsBar[] => {
      const indexBarByResourceName = (persona: Persona) =>
        persona[resourceType].reduce(
          (barIndexedByResourceName, resourceDatum) => {
            if (
              !barIndexedByResourceName[
                resourceDatum.name as MaterialsType & MetalsType
              ]
            ) {
              barIndexedByResourceName[resourceDatum.name] = {
                key: resourceDatum.name,
                label: buildLabel(resourceType, resourceDatum.name),
                total: 0,
              };
            }

            barIndexedByResourceName[resourceDatum.name].total +=
              resourceDatum.value;

            return barIndexedByResourceName;
          },
          {} as Record<MaterialsType | MetalsType, StackedBarsBar>
        );
      return pipe(persona, indexBarByResourceName, Object.values);
    },
    [resourceType]
  );

  const graphStacks: StackedBarsStacks = useMemo(() => {
    const data = stepIdsToDisplay.map((stepIdx): StackedBarsStackData => {
      const bars: StackedBarsBar[] = computeBarsForPersona(
        getPersonaAtStep(stepIdx)
      );
      const total = _.sumBy(bars, "total");
      return {
        label: t(`step.${STEPS[stepIdx].id}.name`),
        total,
        bars,
      };
    });

    return {
      data,
      yAxisUnitLabel: t("unit.tonne.kilo"),
      palettes: resourceType,
      yAxisValueFormatter: formatResource(),
      yAxisTicksValueFormatter: formatResource({ fractionDigits: 0 }),
    };
  }, [
    stepIdsToDisplay,
    resourceType,
    computeBarsForPersona,
    getPersonaAtStep,
    t,
  ]);

  const graphLines: StackedBarsLine[] = useMemo(() => {
    const data = stepIdsToDisplay.map((stepIdx) => {
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
        yAxisValueFormatter: formatProduction(),
        yAxisTicksValueFormatter: formatProduction({ fractionDigits: 0 }),
      } as StackedBarsLine,
    ];
  }, [stepIdsToDisplay, getPersonaAtStep, t]);

  return (
    <>
      <StackedBars
        title={t(`graph.${resourceType}.quantity-per-step-graph.title`, {
          year: ENERGY_SHIFT_TARGET_YEAR,
        })}
        stacks={graphStacks}
        lines={graphLines}
        topRightActions={
          <IconButton onClick={() => setOpenHelpDialog(true)}>
            <Icon name="info-card" width={25} />
          </IconButton>
        }
      />
      <Dialog
        open={openHelpDialog}
        handleClose={() => setOpenHelpDialog(false)}
        content={t("graph.common.information")}
        actions={
          <>
            <Button
              color="secondary"
              variant="contained"
              sx={{ border: 1, borderColor: "secondary" }}
              component="a"
              target="_blank"
              href={MATERIALS_AND_METALS_INFO_CARD_URL}
              onClick={() => setOpenHelpDialog(false)}
              startIcon={<Icon name="open-in-new-tab" />}
            >
              {t("cta.open-info-card")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ border: 1, borderColor: "secondary", mt: 1 }}
              onClick={() => setOpenHelpDialog(false)}
            >
              {t("cta.thanks-for-help")}
            </Button>
          </>
        }
      />
    </>
  );
}
