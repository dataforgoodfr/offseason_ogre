import { Grid, Box } from "@mui/material";
import { LineEvolution } from "../../charts";
import { PlayBox } from "../Components";
import { Typography } from "../../common/components/Typography";
import { Icon } from "../../common/components/Icon";
import { t } from "../../translations";
import { getStepId } from "../constants";
import { StatsData } from "./StatsConsole";
import { roundValue } from "../../common/utils";
import { IGameWithTeams } from "../../../utils/types";
import { usePlay } from "../context/playContext";
import { isLargeGame } from "../utils/game";
import { mean } from "../../../lib/math";

export { ConsumptionStats, ProductionStats };

function ConsumptionStats({
  data,
  statsMaxHeight,
}: {
  statsMaxHeight: number;
  data: StatsData[];
}) {
  const { game } = usePlay();
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
              data={buildGraphData(game, data)}
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
              data={buildGraphData(game, data)}
            />
          </Box>
        </Grid>
      </Grid>
    </PlayBox>
  );
}

function buildGraphData(game: IGameWithTeams, data: StatsData[]) {
  const steps = Object.keys(data[0]?.stepToData || {})
    .map((step) => parseInt(step, 10))
    .sort((stepA, stepB) => stepA - stepB);

  const result = steps.map((step) => {
    const columnLabel = t(`step.${getStepId(step) || "not-found"}.name` as any);
    const columnLines = buildColumnLines(game, data, step);

    return {
      name: columnLabel,
      ...columnLines,
    };
  });
  return result;
}

function buildColumnLines(
  game: IGameWithTeams,
  data: StatsData[],
  step: number
) {
  if (isLargeGame(game)) {
    const valuesByStep = data.map((datum) => datum.stepToData[step] || 0);

    return {
      line1: {
        value: Math.max(...valuesByStep),
        name: t("graph.common.max"),
      },
      line2: {
        value: roundValue(mean(valuesByStep)),
        name: t("graph.common.mean"),
      },
      line3: {
        value: Math.min(...valuesByStep),
        name: t("graph.common.min"),
      },
    };
  }
  return Object.fromEntries(
    data.map((datum) => [
      `line${datum.teamIdx + 1}`,
      {
        value: roundValue(datum.stepToData[step] || 0),
        name: `${t("graph.common.team")} ${datum.teamIdx + 1}`,
      },
    ])
  );
}
