import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Rating } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

import { Typography } from "@mui/material";
import { PlayBox } from "../Components";
import { ActionsHeader } from "./ActionsHeader";
import { Stage } from "../../stages";

import { useQuery } from "react-query";
import axios from "axios";
import { CircularProgress } from "@mui/material";

export { Actions };

function Actions({ currentStage }: { currentStage: Stage }) {
  return (
    <PlayBox>
      <ActionsHeader currentStage={currentStage} />
      <ActionsLayout step={currentStage.step} />
    </PlayBox>
  );
}

function ActionsLayout({ step }: { step: number }) {
  const query = useQuery("actions", () => {
    return axios.get<undefined, { data: { actions: any[] } }>(
      `/api/actions/${step}`
    );
  });
  if (query.isLoading) {
    return <CircularProgress />;
  }
  const actions = query?.data?.data?.actions ?? [];

  return (
    <Box>
      {actions.map((action) => {
        return (
          <ActionLayout
            key={action.id}
            title={action.name}
            financialCost={action.financialCost}
            actionPointCost={action.actionPointCost}
          >
            <Typography>Caractéristiques.</Typography>
          </ActionLayout>
        );
      })}
    </Box>
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
  financialCost,
  actionPointCost,
}: {
  children?: JSX.Element;
  title: string;
  financialCost: number;
  actionPointCost: number;
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
        Coût :
        <Rating
          name="action-points-cost"
          readOnly
          max={3}
          value={actionPointCost}
        />
        <PaidIcon />
        {`${financialCost}€/j`}
      </Box>
    </Box>
  );
}
