import React from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

import { Typography } from "../../common/components/Typography";
import { TeamAction } from "../../../utils/types";
import { useCurrentStep } from "../context/playContext";
import { Accordion } from "../../common/components/Accordion";
import { CURRENT_YEAR_COUNTRY_POWER_NEED_IN_GW, getEnergy } from "../constants";
import { t } from "../../translations";
import { Icon } from "../../common/components/Icon";
import { Slider } from "../../common/components/Slider";
import { TEAM_ACTIONS_MOCKS } from "../constants/mocks";
import { computeProductionEnergyStats } from "../utils/production";
import { Dialog } from "../../common/components/Dialog";

export { TeamActionsContent };

function TeamActionsContent({ style }: { style?: React.CSSProperties }) {
  const currentStep = useCurrentStep();

  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [helpCardLink, setHelpCardLink] = useState("");

  const energiesToDisplay = getEnergy({ stepId: currentStep?.id });
  const energyNameToTeamActions = Object.fromEntries(
    TEAM_ACTIONS_MOCKS.map((teamAction) => [teamAction.action.name, teamAction])
  );

  return (
    <>
      <Box style={style}>
        <Accordion
          options={energiesToDisplay.map((energy) =>
            createTeamActionOption({
              teamAction: energyNameToTeamActions[energy.name],
              onOpenHelpCard: () => {
                setHelpCardLink(energy.helpCardLink);
                setOpenHelpDialog(true);
              },
            })
          )}
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
              Ouvrir la carte
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ border: 1, borderColor: "secondary", mt: 1 }}
              onClick={() => setOpenHelpDialog(false)}
            >
              Merci pour l'aide
            </Button>
          </>
        }
      />
    </>
  );
}

function createTeamActionOption({
  teamAction,
  onOpenHelpCard,
}: {
  teamAction: TeamAction;
  onOpenHelpCard: () => void;
}) {
  return {
    key: teamAction.action.name,
    header: (
      <TeamActionOptionHeader
        teamAction={teamAction}
        onOpenHelpCard={onOpenHelpCard}
      />
    ),
    content: <TeamActionOptionContent teamAction={teamAction} />,
  };
}

function TeamActionOptionHeader({
  teamAction,
  onOpenHelpCard,
}: {
  teamAction: TeamAction;
  onOpenHelpCard: () => void;
}) {
  const handleOnOpenHelpCard = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onOpenHelpCard();
  };

  return (
    <Box display="flex" gap={1}>
      <Icon name="information" onClick={handleOnOpenHelpCard} />
      <Typography>
        {t(`production.energy.${teamAction.action.name}.accordion.title`)}
      </Typography>
    </Box>
  );
}

function TeamActionOptionContent({ teamAction }: { teamAction: TeamAction }) {
  const [value, setValue] = useState(teamAction.value);

  const handleChange = (value: number) => {
    setValue(value);
  };

  const labelFormatter = (value: number) =>
    teamAction.action.unit === "percentage" ? `${value}%` : `${value} m²`;

  const localTeamAction = { ...teamAction, value };
  const localStats = computeProductionEnergyStats(localTeamAction);
  const productionShare =
    teamAction.action.currentYearPowerNeedGw /
    CURRENT_YEAR_COUNTRY_POWER_NEED_IN_GW;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography>
        Puissance installée en France en 2022 :{" "}
        {teamAction.action.currentYearPowerNeedGw.toFixed(2)} GW soit{" "}
        {productionShare.toFixed(2)}%
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
          min={teamAction.action.min}
          max={teamAction.action.max}
          marks={[
            {
              label: `Équipe : ${labelFormatter(teamAction.value)}`,
              value: teamAction.value,
            },
          ]}
          labelFormatter={labelFormatter}
          onChange={handleChange}
          ariaLabel={t(
            `production.energy.${teamAction.action.name}.accordion.label-slider`
          )}
        />
        <Typography>
          {t(
            `production.energy.${teamAction.action.name}.accordion.label-slider`
          )}
        </Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Icon name="player" />
        <Typography>
          Mon hypothèse pour 2050 :{" "}
          <strong>{localStats.powerNeed.toFixed(0)}</strong> GW &amp; Coût :{" "}
          {localStats.cost.toFixed(2)} €/j
        </Typography>
      </Box>

      <ValidateTeamAction
        teamAction={localTeamAction}
        onValidateTeamChoice={() => {}}
      />
    </Box>
  );
}

function ValidateTeamAction({
  teamAction,
  onValidateTeamChoice,
}: {
  teamAction: TeamAction;
  onValidateTeamChoice: () => void;
}) {
  const theme = useTheme();

  const stats = computeProductionEnergyStats(teamAction);

  const backgroundColor = stats.isCredible
    ? theme.palette.status.success
    : theme.palette.status.error;

  const credibilityElement = (
    <Box
      className="validate-team-choices__content__credibility"
      display="flex"
      flexDirection="column"
    >
      {stats.isCredible ? (
        <Typography>Votre Hypothèse est crédible</Typography>
      ) : (
        <>
          <Typography>Votre hypothèse n’est pas crédible :</Typography>
          <Typography>
            {t(
              `production.energy.${teamAction.action.name}.value.not-credible`
            )}
          </Typography>
          <Typography>Cependant, vous pouvez quand même la valider.</Typography>
        </>
      )}
    </Box>
  );

  return (
    <Box
      className="validate-team-choices"
      sx={{
        backgroundColor,
        border: `2px solid #fff`,
        borderRadius: "5px",
        padding: 1,
      }}
      display="flex"
      flexDirection="column"
      gap={1}
    >
      <Box
        className="validate-team-choices__content"
        display="flex"
        flexDirection="row"
        gap={1}
      >
        <Box
          className="validate-team-choices__content__illustration"
          sx={{
            overflow: "hidden",
            flex: "0 0 auto",
            border: `2px solid #fff`,
            borderRadius: "5px",
          }}
          width={44}
          height={44}
        >
          <img src="/ogre-team.png" alt="Ogre team" />
        </Box>
        {credibilityElement}
      </Box>
      <Box
        className="validate-team-choices__actions"
        display="flex"
        justifyContent="end"
      >
        <Button
          sx={{ border: `2px solid ${theme.palette.secondary.main}` }}
          color="primary"
          variant="contained"
          onClick={onValidateTeamChoice}
          type="button"
        >
          <Icon name="check-doubled" />
          <Typography ml={1}>Valider pour l'équipe</Typography>
        </Button>
      </Box>
    </Box>
  );
}
