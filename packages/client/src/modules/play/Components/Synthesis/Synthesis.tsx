import { Box, styled } from "@mui/material";
import { useCallback, useMemo } from "react";
import {
  formatBudget,
  formatCarbonFootprint,
  formatPercentage,
  formatProduction,
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
import { sumReducer } from "../../../../lib/array";
import { ProductionDatum } from "../../../persona/production";
import { usePersona } from "../../context/hooks/player";
import {
  isDirectEnergyConsumption,
  isFossilEnergyConsumption,
  isGreyEnergyConsumption,
} from "../../utils/consumption";
import { isDecarbonatedEnergyProduction } from "../../utils/production";
import TagEnergy from "../../../common/components/TagEnergy";

const CARBON_FOOTPRINT_TONS_THRESHOLD = 2;

export { SynthesisRecap };

function SynthesisRecap({ team }: { team: ITeam }) {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <SynthesisProduction team={team} />
      <SynthesisBudget team={team} />
      <SynthesisCarbon team={team} />
    </Box>
  );
}

function SynthesisConsumption() {
  const { t } = useTranslation();
  const { initialPersona, latestPersona } = usePersona();

  const initialDirectEnergyConsumption = useMemo(
    () =>
      initialPersona.consumption
        .filter(isDirectEnergyConsumption)
        .map((c) => c.value)
        .reduce(sumReducer, 0),
    [initialPersona]
  );
  const finalDirectEnergyConsumption = useMemo(
    () =>
      latestPersona.consumption
        .filter(isDirectEnergyConsumption)
        .map((c) => c.value)
        .reduce(sumReducer, 0),
    [latestPersona]
  );
  const directEnergyConsumptionChange = useMemo(
    () =>
      ((finalDirectEnergyConsumption - initialDirectEnergyConsumption) /
        initialDirectEnergyConsumption) *
      100,
    [finalDirectEnergyConsumption, initialDirectEnergyConsumption]
  );

  const initialFossilEnergyConsumptionShare = useMemo(() => {
    const totalEnergyConsumption = initialPersona.consumption
      .map((c) => c.value)
      .reduce(sumReducer, 0);
    const fossilEnergyConsumption = initialPersona.consumption
      .filter(isFossilEnergyConsumption)
      .map((c) => c.value)
      .reduce(sumReducer, 0);
    return (fossilEnergyConsumption / totalEnergyConsumption) * 100;
  }, [initialPersona]);
  const finalFossilEnergyConsumptionShare = useMemo(() => {
    const totalEnergyConsumption = latestPersona.consumption
      .map((c) => c.value)
      .reduce(sumReducer, 0);
    const fossilEnergyConsumption = latestPersona.consumption
      .filter(isFossilEnergyConsumption)
      .map((c) => c.value)
      .reduce(sumReducer, 0);
    return (fossilEnergyConsumption / totalEnergyConsumption) * 100;
  }, [latestPersona]);

  const initialGreyEnergyConsumption = useMemo(
    () =>
      initialPersona.consumption
        .filter(isGreyEnergyConsumption)
        .map((c) => c.value)
        .reduce(sumReducer, 0),
    [initialPersona]
  );
  const finalGreyEnergyConsumption = useMemo(
    () =>
      latestPersona.consumption
        .filter(isGreyEnergyConsumption)
        .map((c) => c.value)
        .reduce(sumReducer, 0),
    [latestPersona]
  );
  const greyEnergyConsumptionChange = useMemo(
    () =>
      ((finalGreyEnergyConsumption - initialGreyEnergyConsumption) /
        initialGreyEnergyConsumption) *
      100,
    [finalGreyEnergyConsumption, initialGreyEnergyConsumption]
  );

  return (
    <CardStyled display="flex" flexDirection="column" gap={3} p={1}>
      <Box display="flex" alignItems="center" gap={1}>
        <Icon name="consumption" />
        <Typography variant="h4">
          {t("synthesis.player.general-section.consumption.title")}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Typography
          dangerouslySetInnerHTML={{
            __html: t(
              directEnergyConsumptionChange <= 0
                ? "synthesis.player.general-section.consumption.final-direct-energy-consumption-decreased"
                : "synthesis.player.general-section.consumption.final-direct-energy-consumption-increased",
              {
                finalDirectEnergyConsumption: t("unit.watthour-per-day.kilo", {
                  value: formatProduction(finalDirectEnergyConsumption, {
                    fractionDigits: 1,
                  }),
                }),
                directEnergyConsumptionChange: t("unit.percentage", {
                  value: formatPercentage(
                    Math.abs(directEnergyConsumptionChange)
                  ),
                }),
              }
            ),
          }}
        />
        <Typography
          dangerouslySetInnerHTML={{
            __html: t(
              "synthesis.player.general-section.consumption.fossil-energy-consumption-share-change",
              {
                initialFossilEnergyConsumptionShare: t("unit.percentage", {
                  value: formatPercentage(
                    Math.abs(initialFossilEnergyConsumptionShare)
                  ),
                }),
                finalFossilEnergyConsumptionShare: t("unit.percentage", {
                  value: formatPercentage(
                    Math.abs(finalFossilEnergyConsumptionShare)
                  ),
                }),
              }
            ),
          }}
        />
        <Typography
          dangerouslySetInnerHTML={{
            __html: t(
              greyEnergyConsumptionChange <= 0
                ? "synthesis.player.general-section.consumption.final-grey-energy-consumption-decreased"
                : "synthesis.player.general-section.consumption.final-grey-energy-consumption-increased",
              {
                finalGreyEnergyConsumption: t("unit.watthour-per-day.kilo", {
                  value: formatProduction(finalGreyEnergyConsumption, {
                    fractionDigits: 1,
                  }),
                }),
                greyEnergyConsumptionChange: t("unit.percentage", {
                  value: formatPercentage(
                    Math.abs(greyEnergyConsumptionChange)
                  ),
                }),
              }
            ),
          }}
        />
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <TagEnergy energyType="direct" />
          <TagNumber
            value={directEnergyConsumptionChange}
            formatter={(value) =>
              t("unit.percentage", {
                value: formatPercentage(value),
              })
            }
            successDirection="decrease"
          />
        </Box>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <TagEnergy energyType="fossil" />
          <Tag
            type={
              finalFossilEnergyConsumptionShare -
                initialFossilEnergyConsumptionShare <
              0
                ? "success"
                : "error"
            }
          >
            {t("value.evolution", {
              initialValue: t("unit.percentage", {
                value: formatPercentage(
                  Math.abs(initialFossilEnergyConsumptionShare)
                ),
              }),
              finalValue: t("unit.percentage", {
                value: formatPercentage(
                  Math.abs(finalFossilEnergyConsumptionShare)
                ),
              }),
            })}
          </Tag>
        </Box>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <TagEnergy energyType="grey" />
          <TagNumber
            value={greyEnergyConsumptionChange}
            formatter={(value) =>
              t("unit.percentage", {
                value: formatPercentage(value),
              })
            }
            successDirection="decrease"
          />
        </Box>
      </Box>
    </CardStyled>
  );
}

function SynthesisProduction({ team }: { team: ITeam | null }) {
  const { t } = useTranslation();
  const { productionOfCountryToday } = usePlay();
  const { getTeamById } = useTeamValues();
  const teamValues = getTeamById(team?.id);

  const computeRenewableEnergyProduction = useCallback(
    (production: ProductionDatum[] = []) =>
      production
        .filter(isDecarbonatedEnergyProduction)
        .map((production) => production.value)
        .reduce(sumReducer, 0),
    []
  );

  const initialRenewableEnergyProduction = useMemo(
    () => computeRenewableEnergyProduction(productionOfCountryToday),
    [productionOfCountryToday, computeRenewableEnergyProduction]
  );
  const finalRenewableEnergyProduction = useMemo(
    () => computeRenewableEnergyProduction(teamValues?.productionCurrent),
    [teamValues?.productionCurrent, computeRenewableEnergyProduction]
  );

  const renewableEnergyProductionChange = useMemo(
    () =>
      ((finalRenewableEnergyProduction - initialRenewableEnergyProduction) /
        initialRenewableEnergyProduction) *
      100,
    [finalRenewableEnergyProduction, initialRenewableEnergyProduction]
  );

  return (
    <CardStyled display="flex" flexDirection="column" gap={3} p={1}>
      <Box display="flex" alignItems="center" gap={1}>
        <Icon name="production" />
        <Typography variant="h4">
          {t("synthesis.player.general-section.production.title")}
        </Typography>
      </Box>

      <Box>
        <Typography
          dangerouslySetInnerHTML={{
            __html: t(
              renewableEnergyProductionChange >= 0
                ? "synthesis.player.general-section.production.final-renewable-production-increased"
                : "synthesis.player.general-section.production.final-renewable-production-decreased",
              {
                finalProduction: t("unit.watthour-per-day-per-person.kilo", {
                  value: formatProduction(finalRenewableEnergyProduction, {
                    fractionDigits: 1,
                  }),
                }),
                productionChange: t("unit.percentage", {
                  value: formatPercentage(
                    Math.abs(renewableEnergyProductionChange)
                  ),
                }),
              }
            ),
          }}
        />
      </Box>

      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
        <TagEnergy energyType="renewable" />
        <TagNumber
          value={renewableEnergyProductionChange}
          formatter={(value) =>
            t("unit.percentage", {
              value: formatPercentage(value),
            })
          }
        />
      </Box>
    </CardStyled>
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
        />
      </Box>

      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
        <Tag
          type={
            teamCarbonFootprintInTonPerYear <= CARBON_FOOTPRINT_TONS_THRESHOLD
              ? "success"
              : "error"
          }
        >
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
