import { Box } from "@mui/material";
import { useCallback, useMemo } from "react";
import {
  formatPercentage,
  formatProduction,
} from "../../../../../lib/formatter";
import { useTranslation } from "../../../../translations";
import { Icon } from "../../../../common/components/Icon";
import { usePlay } from "../../../context/playContext";
import { ITeam } from "../../../../../utils/types";
import { Typography } from "../../../../common/components/Typography";
import { TagNumber } from "../../../../common/components/TagNumber";
import { sumReducer } from "../../../../../lib/array";
import { ProductionDatum } from "../../../../persona/production";
import { isDecarbonatedEnergyProduction } from "../../../utils/production";
import { TagEnergy } from "../../../../common/components/TagEnergy";
import { CardStyled } from "../Synthesis.common.styles";
import { useTeamValuesForTeam } from "../../../context/hooks/shared";

export default SynthesisProduction;

function SynthesisProduction({ team }: { team: ITeam | null }) {
  const { t } = useTranslation();
  const { productionOfCountryToday } = usePlay();
  const { teamValues } = useTeamValuesForTeam({ teamId: team?.id });

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
    <CardStyled>
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
