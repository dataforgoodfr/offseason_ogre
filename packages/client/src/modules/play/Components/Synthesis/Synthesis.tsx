import { Box, Typography } from "@mui/material";
import { formatCarbonFootprint } from "../../../../lib/formatter";
import { emphasizeText } from "../../../common/utils";
import { synthesisConstants } from "../../playerActions/constants/synthesis";
import { Icon } from "../../../common/components/Icon";
import { useTeamValues } from "../../context/playContext";
import { ITeamWithPlayers } from "../../../../utils/types";
import { getDaysTo2050 } from "../../../../lib/time";

export { SynthesisRecap, SynthesisBudget, SynthesisCarbon };

function SynthesisRecap({ team }: { team: ITeamWithPlayers }) {
  return (
    <Box>
      <SynthesisBudget team={team} />
      <Box mt={3}>
        <SynthesisCarbon team={team} />
      </Box>
    </Box>
  );
}

function SynthesisBudget({ team }: { team: ITeamWithPlayers | null }) {
  const daysTo2050 = getDaysTo2050();
  const { getTeamById } = useTeamValues();
  const teamValues = getTeamById(team?.id);

  const budget = teamValues?.budgetSpent || 0;

  const budgetSpentPersonal = budget * daysTo2050;
  const budgetSpentTotalFrance =
    (budgetSpentPersonal * synthesisConstants.FRANCE_POPULATION) /
    synthesisConstants.MILLIARD;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
        <Icon name="budget" /> Synthèse du budget
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

function SynthesisCarbon({ team }: { team: ITeamWithPlayers | null }) {
  const { getTeamById } = useTeamValues();
  const teamValues = getTeamById(team?.id);
  const teamCarbonFootprintInKgPerDay = teamValues?.carbonFootprint || 0;
  const carbonFootprintReduction = teamValues?.carbonFootprintReduction || 0;

  const teamCarbonFootprintInTonPerYear =
    teamCarbonFootprintInKgPerDay *
    synthesisConstants.DAYS_IN_YEAR *
    synthesisConstants.KG_TO_TON;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
        <Icon name="carbon-footprint" /> Bilan carbone
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        Suite à vos choix l'empreinte carbone est de{" "}
        {emphasizeText(formatCarbonFootprint(teamCarbonFootprintInTonPerYear))}{" "}
        tonnes/an/personne
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        Ce qui correspond à une {emphasizeText("baisse")} de{" "}
        {emphasizeText(carbonFootprintReduction.toFixed(1))}%
      </Typography>
    </Box>
  );
}
