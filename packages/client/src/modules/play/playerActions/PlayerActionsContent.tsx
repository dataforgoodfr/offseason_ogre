import React, { useMemo, useState } from "react";
import { Box, Rating, IconButton } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import { Spacer } from "../../common/components/Spacer";
import { Typography } from "../../common/components/Typography";
import { PlayerActions } from "../../../utils/types";
import { usePlay } from "../context/playContext";
import { ActionHelpDialog } from "./HelpDialogs";
import { Dialog } from "../../common/components/Dialog";
import { Icon } from "../../common/components/Icon";
import { useCurrentPlayer } from "../context/hooks/player";
import { useTranslation } from "../../translations";
import { Button } from "../../common/components/Button";

export { PlayerActionsContent };

function PlayerActionsContent() {
  const { t } = useTranslation();
  const {
    consumptionActionById,
    updatePlayerActions,
    setActionPointsLimitExceeded,
  } = usePlay();
  const {
    player,
    actionPointsAvailableAtCurrentStep,
    playerActionsAtCurrentStep: playerActions,
  } = useCurrentPlayer();

  const handleActionChange = (playerActionId: number, isPerformed: boolean) => {
    setActionPointsLimitExceeded(false);
    updatePlayerActions([
      {
        id: playerActionId,
        isPerformed,
      },
    ]);
  };

  return (
    <Box>
      {playerActions.map((playerAction) => {
        return (
          <ActionLayout
            key={playerAction.id}
            playerAction={playerAction}
            onPlayerActionChanged={(isPerformed) =>
              handleActionChange(playerAction.id, isPerformed)
            }
            helpCardLink={
              consumptionActionById[playerAction.actionId].helpCardLink
            }
          />
        );
      })}

      <Dialog
        open={!!player.actionPointsLimitExceeded}
        handleClose={() => setActionPointsLimitExceeded(false)}
        actions={
          <>
            <Button onClick={() => setActionPointsLimitExceeded(false)}>
              {t("cta.close")}
            </Button>
          </>
        }
      >
        <Typography
          dangerouslySetInnerHTML={{
            __html: t(
              "page.player.player-actions.action-points-limit-exceeded",
              {
                actionPointsAvailableCount: actionPointsAvailableAtCurrentStep,
              }
            ),
          }}
        ></Typography>
      </Dialog>
    </Box>
  );
}

const CustomCheckbox = styled(Checkbox)(() => ({
  path: {
    color: "#C4C4C4",
    fill: "#C4C4C4",
  },
}));

function ActionLayout({
  playerAction,
  onPlayerActionChanged,
  helpCardLink,
}: {
  playerAction: PlayerActions;
  onPlayerActionChanged: (isPerformed: boolean) => void;
  helpCardLink: string;
}) {
  const { t } = useTranslation(["common", "consumption-actions", "countries"]);
  const { consumptionActionById } = usePlay();
  const [openHelp, setOpenHelp] = useState(false);

  const handleClickOpenHelp = () => setOpenHelp(true);
  const handleCloseHelp = () => setOpenHelp(false);

  const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPlayerActionChanged(event.target.checked);
  };

  const consumptionAction = useMemo(
    () => consumptionActionById[playerAction.actionId],
    [consumptionActionById, playerAction]
  );

  return (
    <Box
      sx={{
        display: "flex",
        marginBottom: 2,
        padding: 1,
        borderRadius: 1,
        border: `2px solid white`,
      }}
    >
      <Box>
        <Typography alignItems="center" display="flex" variant="h6">
          <IconButton
            aria-label="help with current step"
            sx={{ paddingLeft: 0 }}
            onClick={handleClickOpenHelp}
          >
            <Icon name="information" sx={{ marginRight: 1, color: "white" }} />
          </IconButton>
          <ActionHelpDialog
            open={openHelp}
            handleClose={handleCloseHelp}
            message={t("page.player.player-actions.help.action")}
            helpCardLink={helpCardLink}
          />
          {t(
            `consumption-actions:consumption-action.${consumptionAction.name}.title`
          )}
        </Typography>
        <Box sx={{ gap: 2 }} display="flex" alignItems="center" mt={1}>
          <Box sx={{ gap: 1 }} display="flex" alignItems="center">
            <Icon name="action-points" />
            <Rating
              name="action-points-cost"
              readOnly
              max={3}
              value={consumptionAction.actionPointCost}
            />
          </Box>
          <Box sx={{ gap: 1 }} display="flex" alignItems="center">
            <Icon name="budget" />
            {t("unit.budget-per-day.base", {
              value: consumptionAction.financialCost,
              symbol: t("countries:country.fr.currency.symbol"),
            })}
          </Box>
        </Box>
      </Box>

      <Spacer />

      <CustomCheckbox
        checked={playerAction.isPerformed}
        onChange={handleActionChange}
        inputProps={{ "aria-label": "controlled" }}
      />
    </Box>
  );
}
