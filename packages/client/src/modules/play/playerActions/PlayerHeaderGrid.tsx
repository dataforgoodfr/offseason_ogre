import { Grid } from "@mui/material";
import { ReactNode } from "react";

import { PlayerHeader } from "../PlayerPersona/PlayerHeader";
import { CustomGrid } from "./PlayerHeaderGrid.styles";

export { PlayerHeaderGrid };

interface PlayerActionsHeaderProps {
  additionalActions?: ReactNode;
}

function PlayerHeaderGrid({
  additionalActions = null,
}: PlayerActionsHeaderProps) {
  return (
    <CustomGrid
      className="player-actions-header"
      container
      item
      direction="column"
      xs={12}
      sm={3}
      sx={{
        pl: 1,
        pr: 1,
        justifyContent: "space-between",
      }}
    >
      <Grid item>
        <PlayerHeader />
      </Grid>
      <Grid
        item
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {additionalActions}
      </Grid>
    </CustomGrid>
  );
}
