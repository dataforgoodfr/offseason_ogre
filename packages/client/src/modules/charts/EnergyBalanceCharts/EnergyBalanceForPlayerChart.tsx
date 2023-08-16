import { Box } from "@mui/material";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import {
  StackedBars,
  StackedBarsBar,
  StackedBarsStackData,
  StackedBarsStacks,
} from "../StackedBars";
import { Persona } from "../../persona/persona";
import { STEPS, getStepTypes } from "../../play";
import { formatProduction } from "../../../lib/formatter";
import { usePlay } from "../../play/context/playContext";
import { useTranslation } from "../../translations/useTranslation";
import { StepDatum } from "./types";
import {
  computeConsumptionBarsForPersona,
  computeProductionBarsForPersona,
  getStackName,
} from "./utils";
import { EnergyBalanceDetailsForPlayerGraph } from "./EnergyBalanceDetailsForPlayerGraph";

export { EnergyBalanceForPlayerChart };

function EnergyBalanceForPlayerChart({
  getPersonaAtStep,
}: {
  getPersonaAtStep: (step: number) => Persona;
}) {
  const { t } = useTranslation();
  const { game } = usePlay();
  const [selectedStepDatum, setSelectedStepDatum] = useState<StepDatum | null>(
    null
  );

  const stepDataToDisplay = useMemo((): StepDatum[] => {
    const maxStep = STEPS.findIndex((s) => s.id === "final-situation");
    const endStep = Math.min(game.lastFinishedStep + 1, maxStep);

    return _.range(0, endStep)
      .map(getStepTypes)
      .map((stepTypes, idx) =>
        stepTypes.map((stepType) => ({ step: idx, type: stepType }))
      )
      .flat();
  }, [game.lastFinishedStep]);

  const MainGraph = useMemo(() => {
    const data = stepDataToDisplay.map((stepDatum): StackedBarsStackData => {
      const computeBars =
        stepDatum.type === "consumption"
          ? computeConsumptionBarsForPersona
          : computeProductionBarsForPersona;
      const bars: StackedBarsBar[] = computeBars({
        persona: getPersonaAtStep(stepDatum.step),
        t,
      });
      const total = _.sumBy(bars, "total");
      const label = getStackName({ stepDatum, t });

      return {
        label,
        total,
        bars,
      };
    });

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
        title={t("graph.energy-balance-for-player-graph.title")}
        stacks={stacks}
        onClick={(chartState) => {
          if (chartState?.activeTooltipIndex != null) {
            const stepDatum = stepDataToDisplay[chartState.activeTooltipIndex];
            setSelectedStepDatum(stepDatum);
          }
        }}
      />
    );
  }, [stepDataToDisplay, getPersonaAtStep, t]);

  return (
    <Box>
      {MainGraph}
      {selectedStepDatum && (
        <EnergyBalanceDetailsForPlayerGraph
          stepDatum={selectedStepDatum}
          getPersonaAtStep={getPersonaAtStep}
        />
      )}
    </Box>
  );
}
