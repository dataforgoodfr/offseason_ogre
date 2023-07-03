import { Tag } from "../Tag/Tag";
import { Icon } from "../Icon";
import { useTheme } from "@mui/material";
import { useTranslation } from "../../../translations";

export { TagEnergy };

function TagEnergy({
  energyType,
}: {
  energyType: "direct" | "grey" | "fossil" | "mixte" | "renewable";
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tag
      icon={<Icon name="energy" sx={{ width: "1rem", height: "1rem" }} />}
      color={theme.palette.energy[energyType]}
    >
      {t(`energy.${energyType}`)}
    </Tag>
  );
}
