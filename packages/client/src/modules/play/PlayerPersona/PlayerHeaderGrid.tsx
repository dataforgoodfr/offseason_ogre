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
    <CustomGrid className="player-header-grid">
      <Grid item>
        <PlayerHeader />
      </Grid>
      <Grid
        item
        sx={{
          ml: "auto",
          mr: "auto",
        }}
      >
        {additionalActions}
      </Grid>
    </CustomGrid>
  );
}
