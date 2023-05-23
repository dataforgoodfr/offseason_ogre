import { Grid, Box } from "@mui/material";
import { LineEvolution } from "../../charts";
import { PlayBox } from "../Components";
import { Typography } from "../../common/components/Typography";
import { Icon } from "../../common/components/Icon";
import { getStepId } from "../constants";
import { StatsData } from "./StatsConsole";
import { roundValue } from "../../common/utils";
import { usePlay } from "../context/playContext";
import { mean } from "../../../lib/math";
import { useTranslation } from "../../translations/useTranslation";
import { I18nTranslateFunction } from "../../translations";
import { IEnrichedGame } from "../../../utils/types";

export { ConsumptionStats, ProductionStats };

function ConsumptionStats({
  data,
  statsMaxHeight,
}: {
  statsMaxHeight: number;
  data: StatsData[];
}) {
  const { game } = usePlay();
  const { t } = useTranslation();

  return (
    <PlayBox mt={2}>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            display="flex"
            alignItems="center"
            justifyContent="center"
            variant="h5"
          >
            <Icon sx={{ mr: 1 }} name="consumption" />
            {t("graph.energy.consumption.title")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={2}>
            <LineEvolution
              chartMaxHeight={statsMaxHeight}
              data={buildGraphData(game, data, t)}
            />
          </Box>
        </Grid>
      </Grid>
    </PlayBox>
  );
}

function ProductionStats({
  data,
  statsMaxHeight,
}: {
  statsMaxHeight: number;
  data: StatsData[];
}) {
  const { game } = usePlay();
  const { t } = useTranslation();

  return (
    <PlayBox mt={2}>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            display="flex"
            alignItems="center"
            justifyContent="center"
            variant="h5"
          >
            <Icon sx={{ mr: 1 }} name="production" />{" "}
            {t("graph.energy.production.title")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={2}>
            <LineEvolution
              chartMaxHeight={statsMaxHeight}
              data={buildGraphData(game, data, t)}
            />
          </Box>
        </Grid>
      </Grid>
    </PlayBox>
  );
}

function buildGraphData(
  game: IEnrichedGame,
  data: StatsData[],
  t: I18nTranslateFunction
) {
  const steps = Object.keys(data[0]?.stepToData || {})
    .map((step) => parseInt(step, 10))
    .sort((stepA, stepB) => stepA - stepB);

  const result = steps.map((step) => {
    const columnLabel = t(`step.${getStepId(step) || "not-found"}.name` as any);
    const columnLines = buildColumnLines(game, data, step, t);

    return {
      name: columnLabel,
      ...columnLines,
    };
  });
  return result;
}

function buildColumnLines(
  game: IEnrichedGame,
  data: StatsData[],
  step: number,
  t: I18nTranslateFunction
) {
  if (game.isLarge) {
    const valuesByStep = data.map((datum) => datum.stepToData[step] || 0);

    return {
      line1: {
        total: Math.max(...valuesByStep),
        label: t("graph.common.max"),
      },
      line2: {
        total: roundValue(mean(valuesByStep)),
        label: t("graph.common.mean"),
      },
      line3: {
        total: Math.min(...valuesByStep),
        label: t("graph.common.min"),
      },
    };
  }
  return Object.fromEntries(
    data.map((datum) => [
      `line${datum.teamIdx + 1}`,
      {
        total: roundValue(datum.stepToData[step] || 0),
        label: `${t("graph.common.team")} ${datum.teamIdx + 1}`,
      },
    ])
  );
}
