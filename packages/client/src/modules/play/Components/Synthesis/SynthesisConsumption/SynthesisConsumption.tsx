import { Box } from "@mui/material";
import { useMemo } from "react";
import {
  formatPercentage,
  formatProduction,
} from "../../../../../lib/formatter";
import { useTranslation } from "../../../../translations";
import { Icon } from "../../../../common/components/Icon";
import { Typography } from "../../../../common/components/Typography";
import { TagNumber } from "../../../../common/components/TagNumber";
import { Tag } from "../../../../common/components/Tag";
import { sumReducer } from "../../../../../lib/array";
import { usePersona } from "../../../context/hooks/player";
import {
  isDirectEnergyConsumption,
  isFossilEnergyConsumption,
  isGreyEnergyConsumption,
} from "../../../utils/consumption";
import { TagEnergy } from "../../../../common/components/TagEnergy";
import { CardStyled } from "../Synthesis.common.styles";

export default SynthesisConsumption;

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
    <CardStyled>
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
