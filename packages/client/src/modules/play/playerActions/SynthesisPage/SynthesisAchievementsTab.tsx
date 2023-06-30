import { PlayBox } from "../../Components";
import { Typography } from "../../../common/components/Typography";
import { Box, styled } from "@mui/material";
import { useTranslation } from "../../../translations";
import { useAchievements } from "../../context/hooks/player/useAchievements";
import { AchievementCard } from "../../Components/AchievementCard";

export { SynthesisAchievementsTab };

function SynthesisAchievementsTab() {
  const { t } = useTranslation();
  const { unlockedAchievements } = useAchievements();

  return (
    <PlayBox display="flex" flexDirection="column" gap={4}>
      <Typography>
        {t("synthesis.player.achievements-section.description")}
      </Typography>
      <CardContainer>
        {unlockedAchievements.map((achievementName) => (
          <Box key={achievementName} display="flex" justifyContent="center">
            <AchievementCard achievementName={achievementName} />
          </Box>
        ))}
      </CardContainer>
    </PlayBox>
  );
}

const CardContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(3),
  justifyContent: "center",
  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "1fr",
  },
}));
