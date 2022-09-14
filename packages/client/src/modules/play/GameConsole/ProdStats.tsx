import { Grid, Box } from "@mui/material";
import { LineEvolution } from "../../charts";
import { PlayBox } from "../Components";
import { Typography } from "../../common/components/Typography";
import { Icon } from "../../common/components/Icon";
import { t } from "../../translations";
import { getStepId } from "../constants";

export { ConsumptionStats, ProductionStats };

function ConsumptionStats({
  data,
}: {
  data: {
    teamIdx: number;
    stepToData: { [key: number]: number };
    playerCount: number;
  }[];
}) {
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
            Évolution des consommations entre équipes
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={2}>
            <LineEvolution data={buildGraphData(data)} />
          </Box>
        </Grid>
      </Grid>
    </PlayBox>
  );
}

function ProductionStats({
  data,
}: {
  data: {
    teamIdx: number;
    stepToData: { [key: number]: number };
    playerCount: number;
  }[];
}) {
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
            <Icon sx={{ mr: 1 }} name="production" /> Évolution des productions
            entre équipes
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={2}>
            <LineEvolution data={buildGraphData(data)} />
          </Box>
        </Grid>
      </Grid>
    </PlayBox>
  );
}

function buildGraphData(
  data: {
    teamIdx: number;
    stepToData: { [key: number]: number };
    playerCount: number;
  }[]
) {
  const steps = Object.keys(data[0]?.stepToData || {})
    .map((step) => parseInt(step, 10))
    .sort((stepA, stepB) => stepA - stepB);

  return steps.map((step) => {
    const columnLabel = t(`step.${getStepId(step) || "not-found"}.name` as any);
    const columnLines = Object.fromEntries(
      data.map((datum) => [
        `line${datum.teamIdx + 1}`,
        datum.stepToData[step] || 0,
      ])
    );

    return {
      name: columnLabel,
      ...columnLines,
    };
  });
}
