import { Box } from "@mui/material";
import { ReactNode } from "react";
import { PageLayout } from "./PlayerPageLayout.styles";

export { PlayerPageLayout };

function PlayerPageLayout({
  header,
  body,
}: {
  header: ReactNode;
  body: ReactNode;
}) {
  return (
    <PageLayout className="player-page-layout">
      <Box
        className="player-page-layout__header"
        display="flex"
        flexDirection="column"
      >
        {header}
      </Box>
      <Box
        className="player-page-layout__body"
        display="flex"
        flexDirection="column"
      >
        {body}
      </Box>
    </PageLayout>
  );
}
