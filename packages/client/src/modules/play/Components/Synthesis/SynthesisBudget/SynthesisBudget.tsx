import { Box } from "@mui/material";
import { formatBudget } from "../../../../../lib/formatter";
import { useTranslation } from "../../../../translations";
import { synthesisConstants } from "../../../playerActions/constants/synthesis";
import { Icon } from "../../../../common/components/Icon";
import { usePlay, useTeamValues } from "../../../context/playContext";
import { ITeam } from "../../../../../utils/types";
import { getDaysToEnergyShiftTargetYear } from "../../../../../lib/time";
import { Typography } from "../../../../common/components/Typography";
import { Tag } from "../../../../common/components/Tag";
import { ENERGY_SHIFT_TARGET_YEAR } from "../../../../common/constants";
import { CardStyled } from "../Synthesis.common.styles";

export default SynthesisBudget;

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
    <CardStyled>
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
        />
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
