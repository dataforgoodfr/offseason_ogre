import { IconButton } from "@mui/material";

import { Typography } from "../../common/components/Typography";
import { Dialog } from "../../common/components/Dialog";
import { TeamActionsRecap } from "../Components/TeamActionsRecap";
import { Icon } from "../../common/components/Icon";
import { useCurrentPlayer } from "../context/hooks/player";
import { useTranslation } from "../../translations";
import { useDialog } from "../../common/hooks/useDialog";
import { ENERGY_SHIFT_TARGET_YEAR } from "../../common/constants";

export { TeamActionsHeader };

function TeamActionsHeader() {
  const { t } = useTranslation(["common", "countries"]);
  const { teamActionsAtCurrentStep } = useCurrentPlayer();
  const { isOpen, closeDialog, openDialog } = useDialog();

  return (
    <>
      <TeamActionsRecap
        teamActions={teamActionsAtCurrentStep}
        helper={
          <IconButton aria-label="help with current step" onClick={openDialog}>
            <Icon name="helper" sx={{ color: "white" }} />
          </IconButton>
        }
      />

      <Dialog open={isOpen} handleClose={closeDialog}>
        <Typography
          dangerouslySetInnerHTML={{
            __html: t("page.player.team-actions.help.step", {
              year: ENERGY_SHIFT_TARGET_YEAR,
            }),
          }}
        ></Typography>
      </Dialog>
    </>
  );
}
