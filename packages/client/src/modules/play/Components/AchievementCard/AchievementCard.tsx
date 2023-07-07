import { Typography } from "../../../common/components/Typography";
import { Box, styled } from "@mui/material";
import { useTranslation } from "../../../translations";
import { Card } from "../../../common/components/Card";
import { AchievementName } from "../../../../utils/types";
import { ENERGY_SHIFT_TARGET_YEAR } from "../../../common/constants";

export { AchievementCard };

function AchievementCard({
  achievementName,
}: {
  achievementName: AchievementName;
}) {
  const { t } = useTranslation(["common", "achievements"]);

  return (
    <AchievementCardHost
      className={`achievement-card card--${t(
        `achievements:achievement.${achievementName}.type`
      )}-type`}
      display="flex"
      flexDirection="column"
      gap={3}
      px={2}
      py={3}
    >
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography className="achievement-card__title" variant="h4">
          {t(`achievements:achievement.${achievementName}.title`)}
        </Typography>
      </Box>
      <Box
        className="achievement-card__icon-container"
        display="flex"
        justifyContent="center"
      >
        <AchievementCardImage
          src={`/achievements/${t(
            `achievements:achievement.${achievementName}.iconSrc`
          )}`}
          alt={`/achievements/${t(
            `achievements:achievement.${achievementName}.iconAlt`
          )}`}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography className="achievement-card__description">
          {t(`achievements:achievement.${achievementName}.description`, {
            targetYear: ENERGY_SHIFT_TARGET_YEAR,
          })}
        </Typography>
      </Box>
    </AchievementCardHost>
  );
}

const AchievementCardHost = styled(Card)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: 330,
  minHeight: 460,
  borderWidth: 8,
  borderColor: theme.palette.backgrounds.page,
  transition: "all .2s ease-in-out",
  backgroundImage: `linear-gradient(
    45deg,
    hsl(208deg 56% 23%) 0%,
    hsl(208deg 55% 25%) 20%,
    hsl(208deg 55% 27%) 29%,
    hsl(208deg 55% 29%) 36%,
    hsl(208deg 54% 31%) 43%,
    hsl(208deg 54% 33%) 50%,
    hsl(208deg 55% 30%) 57%,
    hsl(208deg 55% 27%) 64%,
    hsl(208deg 56% 25%) 71%,
    hsl(208deg 56% 22%) 80%,
    hsl(208deg 57% 20%) 100%
  );`,
  [theme.breakpoints.down("sm")]: {
    width: 300,
    minHeight: 420,
  },
  "&.card--default-type": {
    ".achievement-card": {
      "&__icon-container": {
        backgroundImage: `linear-gradient(
          35deg,
          hsl(8deg 100% 77%) 0%,
          hsl(355deg 100% 74%) 33%,
          hsl(348deg 100% 74%) 67%,
          hsl(349deg 100% 80%) 100%
        );`,
      },
    },
  },
  "&.card--production-type": {
    ".achievement-card": {
      "&__icon-container": {
        backgroundImage: `linear-gradient(
          35deg,
          hsl(217deg 96% 81%) 0%,
          hsl(215deg 76% 69%) 33%,
          hsl(208deg 77% 69%) 67%,
          hsl(199deg 88% 87%) 100%
        );`,
      },
    },
  },
  "&:hover": {
    transform: "scale(1.05)",
  },
  ".achievement-card": {
    "&__title": {
      textShadow: "#000000 0px 0px 5px",
    },
    "&__description": {
      textShadow: "#000000 0px 0px 5px",
    },
    "&__icon-container": {
      borderRadius: 8,
      boxShadow: "inset 1px 1px 5px #000000",
    },
  },
}));

const AchievementCardImage = styled("img")(({ theme }) => ({
  width: 180,
  height: 180,
  filter: "drop-shadow(0px 0px 2px #000000)",
  [theme.breakpoints.down("sm")]: {
    width: 160,
    minHeight: 160,
  },
}));
