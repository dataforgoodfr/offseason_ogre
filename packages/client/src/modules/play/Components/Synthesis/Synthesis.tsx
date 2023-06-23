import { Box, styled } from "@mui/material";
import {
  formatBudget,
  formatCarbonFootprint,
  formatPercentage,
} from "../../../../lib/formatter";
import { useTranslation } from "../../../translations";
import { synthesisConstants } from "../../playerActions/constants/synthesis";
import { Icon } from "../../../common/components/Icon";
import { usePlay, useTeamValues } from "../../context/playContext";
import { ITeam } from "../../../../utils/types";
import { getDaysToEnergyShiftTargetYear } from "../../../../lib/time";
import { Card } from "../../../common/components/Card";
import { Typography } from "../../../common/components/Typography";
import { TagNumber } from "../../../common/components/TagNumber";
import { Tag } from "../../../common/components/Tag";
import { ENERGY_SHIFT_TARGET_YEAR } from "../../../common/constants";

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
  const { t } = useTranslation(["common", "countries"]);
  const { game } = usePlay();
  const daysTo2050 = getDaysToEnergyShiftTargetYear(new Date(game.date));
  const { getTeamById } = useTeamValues();
  const teamValues = getTeamById(team?.id);

  const budget = teamValues?.budgetSpent || 0;

  const meanYearlyBudgetPerInhabitant =
    budget * synthesisConstants.DAYS_IN_YEAR;
  const meanTotalBudgetPerInhabitant = budget * daysTo2050;
  const totalCountryBudget =
    (meanTotalBudgetPerInhabitant * t("countries:country.fr.population.mega")) /
    synthesisConstants.MILLIARD;

  return (
    <CardStyled display="flex" flexDirection="column" gap={3} p={1}>
      <Box display="flex" alignItems="center" gap={1}>
        <Icon name="budget" />
        <Typography variant="h4">
          {t("synthesis.player.general-section.budget.title")}
        </Typography>
      </Box>

      <Box>
        <Typography
          dangerouslySetInnerHTML={{
            __html: t(
              "synthesis.player.general-section.budget.final-mean-budget",
              {
                startYear: new Date(game.date).getFullYear(),
                endYear: ENERGY_SHIFT_TARGET_YEAR,
                finalMeanYearlyBudgetPerInhabitant: t(
                  "unit.budget-per-year-per-person.base",
                  {
                    value: formatBudget(meanYearlyBudgetPerInhabitant, {
                      fractionDigits: 0,
                    }),
                    symbol: t("countries:country.fr.currency.symbol"),
                  }
                ),
                finalMeanTotalBudgetPerInhabitant: t("unit.budget.base", {
                  value: formatBudget(meanTotalBudgetPerInhabitant, {
                    fractionDigits: 0,
                  }),
                  symbol: t("countries:country.fr.currency.symbol"),
                }),
                finalTotalCountryBudget: t("unit.budget.giga", {
                  value: formatBudget(totalCountryBudget, {
                    fractionDigits: 0,
                  }),
                  symbol: t("countries:country.fr.currency.symbol"),
                  count: Math.ceil(totalCountryBudget),
                }),
                countryNameWithArticle: t(
                  "countries:country.fr.name-with-article"
                ),
                countryInhabitantName: t(
                  "countries:country.fr.inhabitant-name"
                ),
              }
            ),
          }}
        ></Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
        <Tag type={"secondary"}>
          {t("unit.budget-per-year-per-inhabitant.base", {
            value: formatBudget(meanYearlyBudgetPerInhabitant, {
              fractionDigits: 0,
            }),
            symbol: t("countries:country.fr.currency.symbol"),
            countryInhabitantName: t("countries:country.fr.inhabitant-name"),
          })}
        </Tag>
      </Box>
    </CardStyled>
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
