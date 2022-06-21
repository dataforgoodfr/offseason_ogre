import { Typography, Grid, Box } from "@mui/material";
import { LineEvolution } from "../../charts";
import { PlayBox } from "../Components";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";

export { ConsumptionStats, ProductionStats };

function ConsumptionStats(
  consumption: { id: number; consumption: number; playerCount: number }[]
) {
  return (
    <PlayBox mt={2}>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            display="flex"
            variant="h5"
            sx={{ textAlign: "center", fontSize: "1em" }}
          >
            {" "}
            <ShoppingCartRoundedIcon sx={{ height: "auto", mr: 2 }} />{" "}
            Comparaison de l'évolution des consommations entre équipes
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={2}>
            <LineEvolution data={buildDataCons(consumption)} />
          </Box>
        </Grid>
      </Grid>
    </PlayBox>
  );
}

function ProductionStats(production: { id: number; production: number }[]) {
  return (
    <PlayBox mt={2}>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            display="flex"
            variant="h5"
            sx={{ textAlign: "center", fontSize: "1em" }}
          >
            {" "}
            <FactoryRoundedIcon sx={{ height: "auto", mr: 2 }} /> Comparaison de
            l'évolution des productions entre équipes{" "}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={2}>
            <LineEvolution data={buildDataProd(production)} />
          </Box>
        </Grid>
      </Grid>
    </PlayBox>
  );
}

function buildDataCons(
  teams: { id: number; consumption: number; playerCount: number }[]
) {
  return [
    {
      name: "Situation initiale",
      team1: teams[0]?.consumption / teams[0]?.playerCount || 0,
      team2: teams[1]?.consumption / teams[1]?.playerCount || 0,
      team3: teams[2]?.consumption / teams[2]?.playerCount || 0,
      team4: teams[3]?.consumption / teams[3]?.playerCount || 0,
      team5: teams[4]?.consumption / teams[4]?.playerCount || 0,
      team6: teams[5]?.consumption / teams[5]?.playerCount || 0,
    },
    {
      name: "Etape 1",
      team1: "1200",
      team2: "1150",
      team3: "1120",
    },
    {
      name: "Etape 2",
      team1: "1100",
      team2: "1098",
      team3: "1087",
    },
    {
      name: "Etape 3",
    },
    {
      name: "Etape 4",
    },
  ];
}

function buildDataProd(teams: { id: number; production: number }[]) {
  return [
    {
      name: "Situation initiale",
      team1: teams[0]?.production,
      team2: teams[1]?.production,
      team3: teams[2]?.production,
      team4: teams[3]?.production,
      team5: teams[4]?.production,
      team6: teams[5]?.production,
    },
    {
      name: "Etape 1",
      team1: "200",
      team2: "300",
      team3: "321",
    },
    {
      name: "Etape 2",
      team1: "590",
      team2: "321",
      team3: "459",
    },
    {
      name: "Etape 3",
    },
    {
      name: "Etape 4",
    },
  ];
}
