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
import { Tag } from "../../../common/components/Tag";
import { useTranslation } from "../../../translations";

export { Game };

function Game() {
  const { t } = useTranslation();
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
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
          {game?.isTest && (
            <Tag type="secondary">{t("game.mode.test").toUpperCase()}</Tag>
          )}
          <Typography variant="h3">Atelier {game?.code}</Typography>
        </Box>

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
