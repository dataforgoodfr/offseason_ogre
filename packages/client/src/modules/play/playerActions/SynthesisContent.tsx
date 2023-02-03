import Button from "@mui/material/Button";
import { Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Typography } from "../../common/components/Typography";
import { useMyTeam, usePlay } from "../context/playContext";
import { Icon } from "../../common/components/Icon";
import { Dialog } from "../../common/components/Dialog";
import { ScenarioNameTextField } from "./SynthesisContent.styles";

export { SynthesisScenarioName };

function SynthesisScenarioName() {
  const { isGameFinished } = usePlay();

  const isTeamEditable = !isGameFinished;

  return (
    <Box display="flex" flexDirection="column" pr={4} gap={3}>
      <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
        <Icon name="team" /> Nom du scénario
        {isTeamEditable && <ScenarioNameEditionHelp />}
      </Typography>
      <Box display="flex" flexDirection="column" gap={3} pl={4}>
        {isTeamEditable ? <ScenarioNameEditable /> : <ScenarioNameReadonly />}
      </Box>
    </Box>
  );
}

function ScenarioNameEditionHelp() {
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
            Donnez un nom à votre scénario pour le futur énergétique de la
            France.
          </Typography>
          <br />
          <Typography>
            Veuillez choisir une personne qui éditera le nom pour l’ensemble de
            l'équipe.
          </Typography>
        </>
      </Dialog>
    </>
  );
}

function ScenarioNameEditable() {
  const theme = useTheme();
  const team = useMyTeam();

  const { updateTeam } = usePlay();

  const [localName, setLocalName] = useState(team?.scenarioName);

  const handleValidateScenarioName = () => {
    updateTeam({ scenarioName: localName });
  };

  const handleChange = (e: any) => {
    setLocalName(e.target.value);
  };

  useEffect(() => setLocalName(team?.scenarioName), [team?.scenarioName]);

  return (
    <>
      <ScenarioNameTextField
        sx={{ textAlign: "center" }}
        id="outlined-basic"
        label="Nom du scénario"
        variant="outlined"
        value={localName}
        onChange={handleChange}
      />
      <Button
        sx={{
          textAlign: "center",
          border: `2px solid ${theme.palette.secondary.main}`,
        }}
        color="primary"
        variant="contained"
        disabled={!localName}
        onClick={handleValidateScenarioName}
        type="button"
      >
        <Icon name="check-doubled" />
        <Typography ml={1}>Valider pour l'équipe</Typography>
      </Button>
    </>
  );
}

function ScenarioNameReadonly() {
  const team = useMyTeam();

  return <Typography>{team?.scenarioName}</Typography>;
}
