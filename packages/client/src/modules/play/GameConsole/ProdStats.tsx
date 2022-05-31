import { Typography, Grid, Box } from "@mui/material";
import { LineEvolution } from "../../charts";
import { PlayBox } from "../Components";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";

export { ConsumptionStats, ProductionStats };

function ConsumptionStats() {
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
            <LineEvolution data={buildDataCons()} />
          </Box>
        </Grid>
      </Grid>
    </PlayBox>
  );
}

function ProductionStats() {
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
            <LineEvolution data={buildDataProd()} />
          </Box>
        </Grid>
      </Grid>
    </PlayBox>
  );
}

function buildDataCons() {
  return [
    {
      name: "Situation initiale",
      team1: "1300",
      team2: "1270",
      team3: "1250",
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

function buildDataProd() {
  return [
    {
      name: "Situation initiale",
      team1: "0",
      team2: "0",
      team3: "0",
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
