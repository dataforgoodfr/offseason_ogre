import React, { useMemo } from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { useState } from "react";

import { Typography } from "../../common/components/Typography";
import { ProductionAction, TeamAction } from "../../../utils/types";
import { usePlay } from "../context/playContext";
import { Accordion } from "../../common/components/Accordion";
import { t } from "../../translations";
import { Icon } from "../../common/components/Icon";
import { Slider } from "../../common/components/Slider";
import { computeTeamActionStats } from "../utils/production";
import { Dialog } from "../../common/components/Dialog";
import { formatBudget, formatProductionGw } from "../../../lib/formatter";
import { useTranslation } from "../../translations/useTranslation";
import { ENERGY_SHIFT_TARGET_YEAR } from "../../common/constants";
import { useCurrentPlayer } from "../context/hooks/player";

export { TeamActionsContent };

function TeamActionsContent({ style }: { style?: React.CSSProperties }) {
  const { teamActionsAtCurrentStep } = useCurrentPlayer();
  const { t } = useTranslation();
  const { productionActionById } = usePlay();

  const [openHelpDialog, setOpenHelpDialog] = useState(false);
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
                  setOpenHelpDialog(true);
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
        open={openHelpDialog}
        handleClose={() => setOpenHelpDialog(false)}
        content="Voici le lien vers une carte qui te donnera des informations sur le moyen de production pour t’aider dans l’arbitrage :"
        actions={
          <>
            <Button
              color="secondary"
              variant="contained"
              sx={{ border: 1, borderColor: "secondary" }}
              component="a"
              target="_blank"
              href={helpCardLink}
              onClick={() => setOpenHelpDialog(false)}
              startIcon={<Icon name="open-in-new-tab" />}
            >
              {t("cta.open-info-card")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ border: 1, borderColor: "secondary", mt: 1 }}
              onClick={() => setOpenHelpDialog(false)}
            >
              {t("cta.thanks-for-help")}
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
  const handleOnOpenHelpCard = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onOpenHelpCard();
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Icon name="information" onClick={handleOnOpenHelpCard} />
      <Typography>
        {t(
          `production.energy.${
            productionActionById[teamAction.actionId].name
          }.accordion.title`
        )}
      </Typography>
    </Box>
  );
}

function TeamActionOptionContent({ teamAction }: { teamAction: TeamAction }) {
  const { productionActionById, updateTeam } = usePlay();

  const [value, setValue] = useState(teamAction.value);

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

  const actionUnit =
    productionActionById[teamAction.actionId].unit === "percentage"
      ? "%"
      : " m²";
  const labelFormatter = (value: number) => `${value}${actionUnit}`;

  const localTeamAction = { ...teamAction, value };
  const localStats = computeTeamActionStats(
    localTeamAction,
    productionActionById
  );

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography>
        Puissance installée en France en 2022 :{" "}
        {formatProductionGw(
          productionActionById[teamAction.actionId].currentYearPowerNeedGw
        )}{" "}
        GW soit {productionActionById[teamAction.actionId].defaultTeamValue}
        {actionUnit}
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        maxWidth={400}
        paddingX={2}
      >
        <Slider
          value={value}
          min={productionActionById[teamAction.actionId].min}
          max={productionActionById[teamAction.actionId].max}
          marks={[
            {
              label: `Équipe : ${labelFormatter(teamAction.value)}`,
              value: teamAction.value,
            },
          ]}
          labelFormatter={labelFormatter}
          onChange={handleChange}
          ariaLabel={t(
            `production.energy.${
              productionActionById[teamAction.actionId].name
            }.accordion.label-slider`
          )}
        />
        <Typography>
          {t(
            `production.energy.${
              productionActionById[teamAction.actionId].name
            }.accordion.label-slider`
          )}
        </Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Icon name="player" />
        <Typography>
          Mon hypothèse pour 2050 :{" "}
          <strong>{formatProductionGw(localStats.powerNeedGw)}</strong> GW &amp;
          Coût : {formatBudget(localStats.cost)} €/j
        </Typography>
      </Box>

      <TeamActionCredibility teamAction={localTeamAction} />

      <Box
        className="team-action-option-content__actions"
        display="flex"
        justifyContent="end"
      >
        <Button
          color="secondary"
          variant="contained"
          onClick={handleValidateTeamChoice}
          type="button"
        >
          <Icon name="check-doubled" sx={{ mr: 1 }} />
          Valider pour l'équipe
        </Button>
      </Box>
    </Box>
  );
}

function TeamActionCredibility({ teamAction }: { teamAction: TeamAction }) {
  const { ready, t } = useTranslation();
  const { productionActionById } = usePlay();

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
        `production.energy.${
          productionActionById[teamAction.actionId].name
        }.value.credible`,
        {
          year: ENERGY_SHIFT_TARGET_YEAR,
          returnObjects: true,
        }
      );
    }
    return t(
      `production.energy.${
        productionActionById[teamAction.actionId].name
      }.value.not-credible`,
      {
        year: ENERGY_SHIFT_TARGET_YEAR,
        returnObjects: true,
      }
    );
  }, [isCredible, ready, productionActionById, t, teamAction]);

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
