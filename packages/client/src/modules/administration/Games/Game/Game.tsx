import { Box } from "@mui/material";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { GameInfo } from "./GameInfo";
import { GamePlayers } from "./GamePlayers";
import { GameTeams } from "./GameTeams";
import { http } from "../../../../utils/request";
import { Tabs } from "../../../common/components/Tabs";
import { Typography } from "../../../common/components/Typography";
import { ReactNode } from "react";

export { Game };

function Game() {
  const params = useParams();

  const { data: result } = useQuery(`/api/games/${params.id}`, () => {
    return http.get<undefined, { data: { document: any } }>(
      `/api/games/${params.id}`
    );
  });

  const game = result?.data?.document || null;

  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Gestion d'Atelier
        </Typography>

        <Box display="flex" flexDirection="column">
          <Tabs
            tabs={[
              {
                label: "Informations",
                component: game ? (
                  <TabWrapper>
                    <GameInfo game={game} />
                  </TabWrapper>
                ) : null,
                path: "information",
              },
              {
                label: "Joueurs",
                component: game ? (
                  <TabWrapper>
                    <GamePlayers game={game} />
                  </TabWrapper>
                ) : null,
                path: "players",
              },
              {
                label: "Équipes",
                component: game ? (
                  <TabWrapper>
                    <GameTeams game={game} />
                  </TabWrapper>
                ) : null,
                path: "teams",
              },
            ]}
          ></Tabs>
        </Box>
      </Box>
    </>
  );
}

function TabWrapper({ children }: { children: ReactNode }) {
  return (
    <Box p={2} sx={{ backgroundColor: "white", borderRadius: "0 8px 8px 8px" }}>
      {children}
    </Box>
  );
}
