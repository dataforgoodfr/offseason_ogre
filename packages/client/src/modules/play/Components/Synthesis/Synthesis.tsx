import { Box, Typography } from "@mui/material";
import { formatCarbonFootprint } from "../../../../lib/formatter";
import { emphasizeText } from "../../../common/utils";
import { synthesisConstants } from "../../playerActions/constants/synthesis";
import { persona as initialPersona } from "../../../persona/persona";
import { Icon } from "../../../common/components/Icon";
import { useTeamValues } from "../../context/playContext";
import { ITeamWithPlayers } from "../../../../utils/types";
import { getDaysTo2050 } from "../../utils/time";

export { SynthesisRecap, SynthesisBudget, SynthesisCarbon };

function SynthesisRecap({ team }: { team: ITeamWithPlayers }) {
  const teamsValues = useTeamValues();
  const teamIdToTeamValues = Object.fromEntries(
    teamsValues.map((teamValues) => [teamValues.id, teamValues])
  );

  const teamBudget = teamIdToTeamValues[team.id].budget;
  const teamCarbonFootprintInKgPerDay =
    teamIdToTeamValues[team.id].carbonFootprint;

  const teamCarbonFootprintInTonPerYear =
    teamCarbonFootprintInKgPerDay *
    synthesisConstants.DAYS_IN_YEAR *
    synthesisConstants.KG_TO_TON;

  return (
    <Box>
      <SynthesisBudget budget={teamBudget} />
      <Box mt={3}>
        <SynthesisCarbon carbonFootprint={teamCarbonFootprintInTonPerYear} />
      </Box>
    </Box>
  );
}

function SynthesisBudget({ budget }: { budget: number }) {
  const daysTo2050 = getDaysTo2050();

  const budgetSpentPersonal = (initialPersona.budget - budget) * daysTo2050;
  const budgetSpentTotalFrance =
    (budgetSpentPersonal * synthesisConstants.FRANCE_POPULATION) /
    synthesisConstants.MILLIARD;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
        <Icon name="bill" /> Synthèse du budget
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        En moyenne, vous aurez dépensé{" "}
        {emphasizeText(budgetSpentPersonal.toFixed(0))} € par personne d'ici
        2050
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        Ce qui représente un coût total de{" "}
        {emphasizeText(budgetSpentTotalFrance.toFixed(0))} md€ pour la France
        entre 2020 et 2050
      </Typography>
    </Box>
  );
}

function SynthesisCarbon({ carbonFootprint }: { carbonFootprint: number }) {
  const initialCarbonFootprint =
    initialPersona.carbonFootprint *
    synthesisConstants.DAYS_IN_YEAR *
    synthesisConstants.KG_TO_TON;

  const carbonFootprintReduction =
    (1 - carbonFootprint / initialCarbonFootprint) * 100;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
        <Icon name="carbon-footprint" /> Bilan carbone
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        Suite à vos choix l'empreinte carbone est de{" "}
        {emphasizeText(formatCarbonFootprint(carbonFootprint))}{" "}
        tonnes/an/personne
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        Ce qui correspond à une {emphasizeText("baisse")} de{" "}
        {emphasizeText(carbonFootprintReduction.toFixed(1))}%
      </Typography>
    </Box>
  );
}
