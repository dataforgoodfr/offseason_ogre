import Button from "@mui/material/Button";
import { Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Typography } from "../../common/components/Typography";
import { useMyTeam, usePlay, useTeamValues } from "../context/playContext";
import { Icon } from "../../common/components/Icon";
import { Dialog } from "../../common/components/Dialog";
import { ScenarioNameTextField } from "./SynthesisContent.styles";
import { emphasizeText } from "../../common/utils";
import { synthesisConstants } from "./constants/synthesis";
import { differenceInDays } from "date-fns";
import { persona as initialPersona, persona } from "../../persona/persona";

export { SynthesisScenarioName, SynthesisBudget, SynthesisCarbon };

function SynthesisScenarioName() {
  const theme = useTheme();
  const team = useMyTeam();

  const { updateTeam } = usePlay();

  const [value, setValue] = useState(team?.scenarioName);
  const [openHelp, setOpenHelp] = useState(false);

  const handleValidateScenarioName = () => {
    updateTeam({ scenarioName: value });
  };

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" width="80%" gap={3}>
      <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
        <Icon name="team" /> Nom du scénario
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
              Veuillez choisir une personne qui éditera le nom pour l’ensemble
              de l'équipe.
            </Typography>
          </>
        </Dialog>
      </Typography>
      <ScenarioNameTextField
        sx={{ textAlign: "center" }}
        id="outlined-basic"
        label="Nom du scénario"
        variant="outlined"
        value={value}
        onChange={handleChange}
      />
      <Button
        sx={{
          textAlign: "center",
          border: `2px solid ${theme.palette.secondary.main}`,
        }}
        color="primary"
        variant="contained"
        disabled={!value}
        onClick={handleValidateScenarioName}
        type="button"
      >
        <Icon name="check-doubled" />
        <Typography ml={1}>Valider pour l'équipe</Typography>
      </Button>
    </Box>
  );
}

function SynthesisBudget() {
  const team = useMyTeam();
  const teamValues = useTeamValues();
  const teamBudget = teamValues.find((t) => t.id === team?.id)?.budget || 0;
  const daysTo2050 = Math.round(
    differenceInDays(new Date("01/01/2050"), new Date())
  );

  const budgetSpentPersonal = (initialPersona.budget - teamBudget) * daysTo2050;
  const budgetSpentTotalFrance =
    (budgetSpentPersonal * synthesisConstants.FRANCE_POPULATION) /
    synthesisConstants.MILLIARD;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
        <Icon name="bill" /> Synthèse du budget
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        En moyenne, vous aurez dépensé{" "}
        {emphasizeText(budgetSpentPersonal.toFixed(0))} € par personne d'ici
        2050
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        Ce qui représente un coût total de{" "}
        {emphasizeText(budgetSpentTotalFrance.toFixed(0))} md€ pour la France
        entre 2020 et 2050
      </Typography>
    </Box>
  );
}

function SynthesisCarbon() {
  const team = useMyTeam();
  const teamValues = useTeamValues();
  const carbonFootprintPersonal =
    (teamValues.find((t) => t.id === team?.id)?.carbonFootprint || 0) *
    synthesisConstants.DAYS_IN_YEAR *
    synthesisConstants.KG_TO_TON;

  const initialCarbonFootprint =
    initialPersona.carbonFootprint *
    synthesisConstants.DAYS_IN_YEAR *
    synthesisConstants.KG_TO_TON;

  const carbonFootprintReduction =
    (1 - carbonFootprintPersonal / initialCarbonFootprint) * 100;

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
        <Icon name="carbon-footprint" /> Bilan carbone
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        Suite à vos choix l'empreinte carbone est de{" "}
        {emphasizeText(carbonFootprintPersonal.toFixed(1))} tonnes/an/personne
      </Typography>
      <Typography sx={{ fontSize: "14px" }} ml={4}>
        Ce qui correspond à une {emphasizeText("baisse")} de{" "}
        {emphasizeText(carbonFootprintReduction.toFixed(1))}%
      </Typography>
    </Box>
  );
}
