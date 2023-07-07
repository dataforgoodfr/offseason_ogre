import Button from "@mui/material/Button";
import { Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Typography } from "../../../common/components/Typography";
import { usePlay } from "../../context/playContext";
import { Icon } from "../../../common/components/Icon";
import { Dialog } from "../../../common/components/Dialog";
import { ScenarioNameTextField } from "./SynthesisContent.styles";
import { useTranslation } from "../../../translations/useTranslation";
import { FlexRow } from "../../../common/components/Flex";
import { useCurrentPlayer } from "../../context/hooks/player";

export { SynthesisScenarioName };

function SynthesisScenarioName() {
  const { t } = useTranslation();
  const { game } = usePlay();

  const isTeamEditable = !game.isGameFinished;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
        <Icon name="scenario" /> {t("synthesis.player.scenario-section.title")}
        {isTeamEditable && <ScenarioNameEditionHelp />}
      </Typography>
      <Box display="flex" flexDirection="column" gap={3}>
        {isTeamEditable ? <ScenarioNameEditable /> : <ScenarioNameReadonly />}
      </Box>
    </Box>
  );
}

function ScenarioNameEditionHelp() {
  const { t } = useTranslation();

  const [openHelp, setOpenHelp] = useState(false);

  return (
    <>
      <IconButton
        aria-label="help with current step"
        onClick={() => setOpenHelp(true)}
      >
        <Icon name="helper" sx={{ color: "white" }} />
      </IconButton>
      <Dialog open={openHelp} handleClose={() => setOpenHelp(false)}>
        <>
          <Typography>
            {t("synthesis.player.scenario-section.edit-help.description-1")}
          </Typography>
          <br />
          <Typography>
            {t("synthesis.player.scenario-section.edit-help.description-2")}
          </Typography>
        </>
      </Dialog>
    </>
  );
}

function ScenarioNameEditable() {
  const { t } = useTranslation();
  const { team } = useCurrentPlayer();

  const { updateTeam } = usePlay();

  const [localName, setLocalName] = useState(team?.scenarioName);

  const handleValidateScenarioName = () => {
    if (!localName) {
      return;
    }

    updateTeam({ scenarioName: localName });
  };

  const handleChange = (e: any) => {
    setLocalName(e.target.value);
  };

  useEffect(() => setLocalName(team?.scenarioName), [team?.scenarioName]);

  return (
    <FlexRow gap={2}>
      <Box flexGrow={1}>
        <ScenarioNameTextField
          sx={{ textAlign: "center" }}
          id="outlined-basic"
          label={t("form.field.scenario-name.label")}
          value={localName}
          onChange={handleChange}
        />
      </Box>
      <Button
        color="secondary"
        variant="contained"
        onClick={handleValidateScenarioName}
      >
        <Icon name="check-doubled" />
        <Typography ml={1}>{t("cta.validate-team-choice")}</Typography>
      </Button>
    </FlexRow>
  );
}

function ScenarioNameReadonly() {
  const { team } = useCurrentPlayer();

  return <Typography>{team?.scenarioName}</Typography>;
}
