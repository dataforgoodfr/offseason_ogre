import React, { useCallback, useMemo, useState } from "react";
import { Box } from "@mui/material";

import { Typography } from "../../common/components/Typography";
import { ProductionAction, TeamAction } from "../../../utils/types";
import { usePlay } from "../context/playContext";
import { Accordion } from "../../common/components/Accordion";
import { useTranslation } from "../../translations";
import { Icon } from "../../common/components/Icon";
import { Slider } from "../../common/components/Slider";
import { computeTeamActionStats } from "../utils/production";
import { Dialog } from "../../common/components/Dialog";
import { formatBudget, formatProductionGw } from "../../../lib/formatter";
import { ENERGY_SHIFT_TARGET_YEAR } from "../../common/constants";
import { useCurrentPlayer } from "../context/hooks/player";
import { Button } from "../../common/components/Button";
import { useDialog } from "../../common/hooks/useDialog";

export { TeamActionsContent };

function TeamActionsContent({ style }: { style?: React.CSSProperties }) {
  const { teamActionsAtCurrentStep } = useCurrentPlayer();
  const { t } = useTranslation();
  const { productionActionById } = usePlay();
  const { isOpen, closeDialog, openDialog } = useDialog();

  const [helpCardLink, setHelpCardLink] = useState("");

  return (
    <>
      <Box style={style}>
        <Accordion
          options={teamActionsAtCurrentStep
            .map((teamAction) =>
              createTeamActionOption({
                teamAction,
                productionActionById,
                onOpenHelpCard: () => {
                  setHelpCardLink(
                    productionActionById[teamAction.actionId].helpCardLink
                  );
                  openDialog();
                },
              })
            )
            .filter((option): option is NonNullable<typeof option> =>
              Boolean(option)
            )}
          canOpenMultiplePanels
        />
      </Box>

      <Dialog
        open={isOpen}
        handleClose={closeDialog}
        content={t("page.player.team-actions.help.action")}
        actions={
          <>
            <Button type="secondary" onClick={closeDialog}>
              {t("cta.thanks-for-help")}
            </Button>
            <Button
              iconName="open-in-new-tab"
              to={helpCardLink}
              onClick={closeDialog}
            >
              {t("cta.open-info-card")}
            </Button>
          </>
        }
      />
    </>
  );
}

function createTeamActionOption({
  teamAction,
  productionActionById,
  onOpenHelpCard,
}: {
  teamAction: TeamAction;
  productionActionById: Record<number, ProductionAction>;
  onOpenHelpCard: () => void;
}) {
  if (!teamAction) {
    return null;
  }

  return {
    key: productionActionById[teamAction.actionId].name,
    header: (
      <TeamActionOptionHeader
        teamAction={teamAction}
        productionActionById={productionActionById}
        onOpenHelpCard={onOpenHelpCard}
      />
    ),
    content: <TeamActionOptionContent teamAction={teamAction} />,
  };
}

function TeamActionOptionHeader({
  teamAction,
  productionActionById,
  onOpenHelpCard,
}: {
  teamAction: TeamAction;
  productionActionById: Record<number, ProductionAction>;
  onOpenHelpCard: () => void;
}) {
  const { t } = useTranslation(["common", "production-actions"]);

  const handleOnOpenHelpCard = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      onOpenHelpCard();
    },
    [onOpenHelpCard]
  );

  const productionAction = useMemo(
    () => productionActionById[teamAction.actionId],
    [productionActionById, teamAction]
  );

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Icon name="information" onClick={handleOnOpenHelpCard} />
      <Typography>
        {t(
          `production-actions:production-action.fr.${productionAction.name}.accordion.title`
        )}
      </Typography>
    </Box>
  );
}

function TeamActionOptionContent({ teamAction }: { teamAction: TeamAction }) {
  const { t } = useTranslation(["common", "countries", "production-actions"]);
  const { productionActionById, updateTeam } = usePlay();

  const [value, setValue] = useState(teamAction.value);

  const productionAction = useMemo(
    () => productionActionById[teamAction.actionId],
    [productionActionById, teamAction]
  );

  const productionValueI18n = useCallback(
    (productionValue: number) =>
      productionAction.unit === "percentage"
        ? t("unit.percentage", { value: productionValue })
        : t("unit.area.base", { value: productionValue }),
    [productionAction, t]
  );

  const teamStats = useMemo(
    () => computeTeamActionStats(teamAction, productionActionById),
    [productionActionById, teamAction]
  );

  const localTeamAction = useMemo(
    () => ({ ...teamAction, value }),
    [teamAction, value]
  );
  const localStats = useMemo(
    () => computeTeamActionStats(localTeamAction, productionActionById),
    [localTeamAction, productionActionById]
  );

  const handleValidateTeamChoice = () => {
    updateTeam({
      teamActions: [
        {
          id: teamAction.id,
          value: value,
        },
      ],
    });
  };

  const handleChange = (value: number) => {
    setValue(value);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography>
        {t(
          `production-actions:production-action.fr.${productionAction.name}.installed-power-in-country`,
          {
            year: t(
              `production-actions:production-action.fr.${productionAction.name}.year-of-last-data-update`
            ),
            installedPower: t("unit.power.giga", {
              value: formatProductionGw(
                productionAction.currentYearPowerNeedGw
              ),
            }),
            productionValue: productionValueI18n(
              productionAction.defaultTeamValue
            ),
          }
        )}
      </Typography>

      <Box display="flex" flexDirection="column" gap={1} paddingX={2}>
        <Box display="flex" flexDirection="column" maxWidth={400}>
          <Slider
            value={value}
            min={productionAction.min}
            max={productionAction.max}
            marks={[
              {
                label: t("form.field.slide.team-value.label", {
                  value: productionValueI18n(teamAction.value),
                }),
                value: teamAction.value,
              },
            ]}
            labelFormatter={productionValueI18n}
            onChange={handleChange}
            ariaLabel={t(
              `production-actions:production-action.fr.${productionAction.name}.accordion.label-slider`
            )}
          />
        </Box>
        <Typography>
          {t(
            `production-actions:production-action.fr.${productionAction.name}.accordion.label-slider`
          )}
        </Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Icon name="team" />
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Box display="flex" gap={1}>
            <Typography>
              {t("page.player.team-actions.team-hypothesis", {
                year: ENERGY_SHIFT_TARGET_YEAR,
              })}
            </Typography>
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr" maxWidth={300}>
            <Box display="flex" alignItems="center" gap={1}>
              <Icon name="power" />
              <Typography as="span">
                {t("unit.power.giga", {
                  value: formatProductionGw(teamStats.powerNeedGw),
                })}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Icon name="budget" />
              <Typography as="span">
                {t("unit.budget-per-day.base", {
                  value: formatBudget(teamStats.cost),
                  symbol: t("countries:country.fr.currency.symbol"),
                })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" gap={1}>
          <Icon name="player" />
          <Box display="flex" flexDirection="column" flexGrow={1}>
            <Box display="flex" gap={1}>
              <Typography>
                {t("page.player.team-actions.player-hypothesis", {
                  year: ENERGY_SHIFT_TARGET_YEAR,
                })}
              </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" maxWidth={300}>
              <Box display="flex" alignItems="center" gap={1}>
                <Icon name="power" />
                <Typography as="span">
                  {t("unit.power.giga", {
                    value: formatProductionGw(localStats.powerNeedGw),
                  })}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Icon name="budget" />
                <Typography as="span">
                  {t("unit.budget-per-day.base", {
                    value: formatBudget(localStats.cost),
                    symbol: t("countries:country.fr.currency.symbol"),
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <TeamActionCredibility teamAction={localTeamAction} />
      </Box>

      <Box
        className="team-action-option-content__actions"
        display="flex"
        justifyContent="end"
      >
        <Button iconName="check-doubled" onClick={handleValidateTeamChoice}>
          {t("cta.validate-team-choice")}
        </Button>
      </Box>
    </Box>
  );
}

function TeamActionCredibility({ teamAction }: { teamAction: TeamAction }) {
  const { ready, t } = useTranslation(["common", "production-actions"]);
  const { productionActionById } = usePlay();

  const productionAction = useMemo(
    () => productionActionById[teamAction.actionId],
    [productionActionById, teamAction]
  );

  const { isCredible } = computeTeamActionStats(
    teamAction,
    productionActionById
  );

  const credibilityI18n = useMemo(() => {
    if (!ready) {
      return [];
    }
    if (isCredible) {
      return t(
        `production-actions:production-action.fr.${productionAction.name}.value.credible`,
        {
          year: ENERGY_SHIFT_TARGET_YEAR,
          returnObjects: true,
        }
      );
    }
    return t(
      `production-actions:production-action.fr.${productionAction.name}.value.not-credible`,
      {
        year: ENERGY_SHIFT_TARGET_YEAR,
        returnObjects: true,
      }
    );
  }, [isCredible, productionAction, ready, t]);

  return (
    <Box
      className="team-action-credibility"
      sx={{
        border: `2px solid #fff`,
        borderRadius: "5px",
        padding: 1,
      }}
      display="flex"
      flexDirection="column"
      gap={1}
    >
      <Box
        className="team-action-credibility__content"
        display="flex"
        flexDirection="row"
        gap={1}
      >
        <Box
          className="team-action-credibility__content__illustration"
          sx={{
            overflow: "hidden",
            flex: "0 0 auto",
            border: `2px solid #fff`,
            borderRadius: "5px",
          }}
          width={44}
          height={44}
        >
          <img src="/sage.png" alt="" />
        </Box>
        <Box
          className="team-action-credibility__content__credibility"
          display="flex"
          flexDirection="column"
          gap={1}
        >
          {credibilityI18n.map((text) => (
            <Typography key={text}>{text}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
