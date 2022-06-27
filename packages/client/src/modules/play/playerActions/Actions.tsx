import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Rating } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

import { Typography } from "@mui/material";
import { PlayBox } from "../Components";
import { ActionsHeader } from "./ActionsHeader";

export { Actions };

function Actions() {
  return (
    <PlayBox>
      <ActionsHeader />
      <ActionLayout title="Passer au véhicule électrique">
        <Typography>Caractéristiques.</Typography>
      </ActionLayout>
      <ActionLayout title="Déplacement en voiture">
        <Typography>Caractéristiques.</Typography>
      </ActionLayout>
      <ActionLayout title="Moins d'équipement numérique">
        <Typography>Caractéristiques.</Typography>
      </ActionLayout>
      <ActionLayout title="Arrêt boissons canettes">
        <Typography>Caractéristiques.</Typography>
      </ActionLayout>
      <ActionLayout title="Acheter moins de vêtements">
        <Typography>Caractéristiques.</Typography>
      </ActionLayout>
    </PlayBox>
  );
}

const CustomCheckbox = styled(Checkbox)(() => ({
  path: {
    color: "#C4C4C4",
  },
}));

function ActionLayout({
  children,
  title,
}: {
  children: JSX.Element;
  title: string;
}) {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  return (
    <Box
      sx={{
        mb: 2,
        borderRadius: "5px",
        border: "3px solid #F9C74F",
        padding: 1,
      }}
    >
      <Typography alignItems="center" display="flex" variant="h6">
        <InfoIcon sx={{ mr: 1 }} />
        {title}
        <CustomCheckbox
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Typography>
      <Box display="flex" alignItems="center" mt={1}>
        Cout:
        <Rating name="action-points-cost" readOnly max={3} value={3} />
        <PaidIcon />
        {`${2.19}€/j`}
      </Box>
    </Box>
  );
}
