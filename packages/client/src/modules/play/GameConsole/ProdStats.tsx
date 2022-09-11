import { Typography, Grid, Box } from "@mui/material";
import { LineEvolution } from "../../charts";
import { PlayBox } from "../Components";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";

export { ConsumptionStats, ProductionStats };

function ConsumptionStats(
  consumption: {
    id: number;
    consumption: { step: number; consumption: number }[];
    playerCount: number;
  }[]
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
            <LineEvolution data={buildDataConsumption(consumption)} />
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

function buildDataConsumption(
  teams: {
    id: number;
    consumption: { step: number; consumption: number }[];
    playerCount: number;
  }[]
) {
  return [
    {
      name: "Situation initiale",
      team1: getConsumptionByTeamAndStep(0, 0) / teams[0]?.playerCount || 0,
      team2: getConsumptionByTeamAndStep(1, 0) / teams[1]?.playerCount || 0,
      team3: getConsumptionByTeamAndStep(2, 0) / teams[2]?.playerCount || 0,
      team4: getConsumptionByTeamAndStep(3, 0) / teams[3]?.playerCount || 0,
      team5: getConsumptionByTeamAndStep(4, 0) / teams[4]?.playerCount || 0,
      team6: getConsumptionByTeamAndStep(5, 0) / teams[5]?.playerCount || 0,
    },
    {
      name: "Étape 1",
      team1: getConsumptionByTeamAndStep(0, 1) / teams[0]?.playerCount || 0,
      team2: getConsumptionByTeamAndStep(1, 1) / teams[1]?.playerCount || 0,
      team3: getConsumptionByTeamAndStep(2, 1) / teams[2]?.playerCount || 0,
      team4: getConsumptionByTeamAndStep(3, 1) / teams[3]?.playerCount || 0,
      team5: getConsumptionByTeamAndStep(4, 1) / teams[4]?.playerCount || 0,
      team6: getConsumptionByTeamAndStep(5, 1) / teams[5]?.playerCount || 0,
    },
    {
      name: "Étape 3",
      team1: getConsumptionByTeamAndStep(0, 2) / teams[0]?.playerCount || 0,
      team2: getConsumptionByTeamAndStep(1, 2) / teams[1]?.playerCount || 0,
      team3: getConsumptionByTeamAndStep(2, 2) / teams[2]?.playerCount || 0,
      team4: getConsumptionByTeamAndStep(3, 2) / teams[3]?.playerCount || 0,
      team5: getConsumptionByTeamAndStep(4, 2) / teams[4]?.playerCount || 0,
      team6: getConsumptionByTeamAndStep(5, 2) / teams[5]?.playerCount || 0,
    },
    {
      name: "Final",
      team1: getConsumptionByTeamAndStep(0, 2) / teams[0]?.playerCount || 0,
      team2: getConsumptionByTeamAndStep(1, 2) / teams[1]?.playerCount || 0,
      team3: getConsumptionByTeamAndStep(2, 2) / teams[2]?.playerCount || 0,
      team4: getConsumptionByTeamAndStep(3, 2) / teams[3]?.playerCount || 0,
      team5: getConsumptionByTeamAndStep(4, 2) / teams[4]?.playerCount || 0,
      team6: getConsumptionByTeamAndStep(5, 2) / teams[5]?.playerCount || 0,
    },
  ];

  function getConsumptionByTeamAndStep(teamId: number, step: number) {
    return (
      teams[teamId]?.consumption?.find((v) => v.step === step)?.consumption || 0
    );
  }
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
      name: "Étape 2",
      team1: "200",
      team2: "300",
      team3: "321",
    },
    {
      name: "Étape 4",
      team1: "590",
      team2: "321",
      team3: "459",
    },
    {
      name: "Final",
      team1: "590",
      team2: "321",
      team3: "459",
    },
  ];
}
