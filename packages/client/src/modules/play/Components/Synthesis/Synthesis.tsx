import { Box, styled } from "@mui/material";
import {
  formatCarbonFootprint,
  formatPercentage,
} from "../../../../lib/formatter";
import { useTranslation } from "../../../translations";
import { emphasizeText } from "../../../common/utils";
import { synthesisConstants } from "../../playerActions/constants/synthesis";
import { Icon } from "../../../common/components/Icon";
import { useTeamValues } from "../../context/playContext";
import { ITeam } from "../../../../utils/types";
import { getDaysTo2050 } from "../../../../lib/time";
import { Card } from "../../../common/components/Card";
import { Typography } from "../../../common/components/Typography";
import { TagNumber } from "../../../common/components/TagNumber";
import { Tag } from "../../../common/components/Tag";

export { SynthesisRecap };

function SynthesisRecap({ team }: { team: ITeam }) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <SynthesisBudget team={team} />
      <SynthesisCarbon team={team} />
    </Box>
  );
}

function SynthesisBudget({ team }: { team: ITeam | null }) {
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

function SynthesisCarbon({ team }: { team: ITeam | null }) {
  const { t } = useTranslation();
  const { getTeamById } = useTeamValues();
  const teamValues = getTeamById(team?.id);
  const teamCarbonFootprintInKgPerDay = teamValues?.carbonFootprint || 0;
  const carbonFootprintReduction = teamValues?.carbonFootprintReduction || 0;

  const teamCarbonFootprintInTonPerYear =
    teamCarbonFootprintInKgPerDay *
    synthesisConstants.DAYS_IN_YEAR *
    synthesisConstants.KG_TO_TON;

  return (
    <CardStyled>
      <Box display="flex" alignItems="center" gap={1}>
        <Icon name="carbon-footprint" />
        <Typography variant="h4">
          {t("synthesis.player.general-section.carbon-footprint.title")}
        </Typography>
      </Box>

      <Box>
        <Typography
          dangerouslySetInnerHTML={{
            __html: t(
              "synthesis.player.general-section.carbon-footprint.final-mean-carbon-footprint",
              {
                finalFootprint: t("unit.carbon-per-year-per-person.mega", {
                  value: formatCarbonFootprint(teamCarbonFootprintInTonPerYear),
                  count: Math.ceil(teamCarbonFootprintInTonPerYear),
                }),
                footprintReduction: t("unit.percentage", {
                  value: formatPercentage(carbonFootprintReduction),
                }),
              }
            ),
          }}
        ></Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
        <Tag type={teamCarbonFootprintInTonPerYear <= 2 ? "success" : "error"}>
          {t("unit.carbon-per-year-per-person.mega", {
            value: formatCarbonFootprint(teamCarbonFootprintInTonPerYear),
            count: Math.ceil(teamCarbonFootprintInTonPerYear),
          })}
        </Tag>
        <TagNumber
          value={-carbonFootprintReduction}
          formatter={(value) =>
            t("unit.percentage", {
              value: formatPercentage(value),
            })
          }
          successDirection="decrease"
        />
      </Box>
    </CardStyled>
  );
}

const CardStyled = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));
