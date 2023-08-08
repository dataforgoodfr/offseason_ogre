import { PlayBox } from "../../Components";
import { Typography } from "../../../common/components/Typography";
import {
  ImpactfulAction,
  useMostImpactfulActions,
} from "../../context/hooks/player";
import { Box, Tooltip, styled, useTheme } from "@mui/material";
import { useTranslation } from "../../../translations";
import { formatConsumption, formatPercentage } from "../../../../lib/formatter";
import { Icon } from "../../../common/components/Icon";
import { Card } from "../../../common/components/Card";
import { TagNumber } from "../../../common/components/TagNumber";
import { TagEnergy } from "../../../common/components/TagEnergy";

export { SynthesisMostImpactfulActionsTab };

function SynthesisMostImpactfulActionsTab() {
  const { t } = useTranslation();
  const { mostImpactfulActions } = useMostImpactfulActions();

  return (
    <PlayBox display="flex" flexDirection="column" gap={4}>
      <Typography>
        {t("synthesis.player.most-impactful-actions-section.description")}
      </Typography>
      <CardContainer>
        {mostImpactfulActions.map((impactfulAction, idx) => (
          <ActionCard
            key={impactfulAction.action.name}
            impactfulAction={impactfulAction}
            rank={idx + 1}
          />
        ))}
      </CardContainer>
    </PlayBox>
  );
}

function ActionCard({
  impactfulAction,
  rank,
}: {
  impactfulAction: ImpactfulAction;
  rank: number;
}) {
  const { t } = useTranslation(["common", "consumption-actions"]);
  const theme = useTheme();

  return (
    <Card display="flex" flexDirection="column">
      <ActionCardLayout>
        <ActionCardSideBarLayout
          sx={{
            backgroundColor: theme.palette.backgrounds.page,
            color: "#ffffff",
          }}
        >
          <Typography variant="h4">#{rank}</Typography>
          {impactfulAction.isPerformed && (
            <Tooltip
              placement="top"
              title={t(
                "synthesis.player.most-impactful-actions-section.action-taken"
              )}
            >
              <Typography
                display="flex"
                alignItems="center"
                variant="h4"
                color={theme.palette.primary.contrastText}
                sx={{ cursor: "pointer" }}
              >
                <Icon name="check-circle" />
              </Typography>
            </Tooltip>
          )}
          {!impactfulAction.isPerformed && (
            <Tooltip
              placement="top"
              title={t(
                "synthesis.player.most-impactful-actions-section.action-not-taken"
              )}
            >
              <Typography
                display="flex"
                alignItems="center"
                variant="h4"
                sx={{ cursor: "pointer" }}
              >
                <Icon name="missed" />
              </Typography>
            </Tooltip>
          )}
        </ActionCardSideBarLayout>
        <Box display="flex " flexDirection="column" gap={3} px={1} py={2}>
          <Box display="flex">
            <Typography variant="h4">
              {t(
                `consumption-actions:consumption-action.${impactfulAction.action.name}.title`
              )}
            </Typography>
          </Box>
          <Box display="flex">
            <Box display="flex" flexDirection="column" gap={3}>
              {impactfulAction.consumptionImpacts.map((consoImpact) => (
                <Box
                  key={consoImpact.type}
                  display="flex"
                  flexDirection="column"
                  gap={1}
                >
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    <TagEnergy energyType={consoImpact.type} />
                    <TagNumber
                      value={consoImpact.absolute}
                      formatter={(value) =>
                        t("unit.watthour-per-day.kilo", {
                          value: formatConsumption(value, {
                            fractionDigits: 1,
                          }),
                        })
                      }
                      successDirection="decrease"
                    />
                    <TagNumber
                      value={consoImpact.relative * 100}
                      formatter={(value) =>
                        t("unit.percentage", {
                          value: formatPercentage(value),
                        })
                      }
                      successDirection="decrease"
                    />
                  </Box>
                  <Box display="flex">
                    <Typography>
                      {t("unit.watthour-per-day.kilo", {
                        value: formatConsumption(consoImpact.initial, {
                          fractionDigits: 1,
                        }),
                      })}
                    </Typography>
                    &nbsp;
                    <Typography>→</Typography>&nbsp;
                    <Typography>
                      {t("unit.watthour-per-day.kilo", {
                        value: formatConsumption(consoImpact.final, {
                          fractionDigits: 1,
                        }),
                      })}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </ActionCardLayout>
    </Card>
  );
}

const ActionCardLayout = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const ActionCardSideBarLayout = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "row",
    paddingTop: theme.spacing(1),
  },
}));

const CardContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(2),
}));
