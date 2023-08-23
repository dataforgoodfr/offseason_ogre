import { Box } from "@mui/material";
import {
  formatCarbonFootprint,
  formatPercentage,
} from "../../../../../lib/formatter";
import { useTranslation } from "../../../../translations";
import { synthesisConstants } from "../../../playerActions/constants/synthesis";
import { Icon } from "../../../../common/components/Icon";
import { ITeam } from "../../../../../utils/types";
import { Typography } from "../../../../common/components/Typography";
import { TagNumber } from "../../../../common/components/TagNumber";
import { Tag } from "../../../../common/components/Tag";
import { CardStyled } from "../Synthesis.common.styles";
import { useTeamValuesForTeam } from "../../../context/hooks/shared";

const CARBON_FOOTPRINT_TONS_THRESHOLD = 2;

export default SynthesisCarbon;

function SynthesisCarbon({ team }: { team: ITeam | null }) {
  const { t } = useTranslation();
  const { teamValues } = useTeamValuesForTeam({ teamId: team?.id });
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
