import Cloud from "@mui/icons-material/Cloud";
import DirectionsBike from "@mui/icons-material/DirectionsBike";
import HowToReg from "@mui/icons-material/HowToReg";
import Paid from "@mui/icons-material/Paid";
import Person from "@mui/icons-material/Person";
import { SvgIconProps } from "@mui/material";

export { Icon };

const ICONS = {
  "action-points": DirectionsBike,
  budget: Paid,
  "carbon-footprint": Cloud,
  "player-finished": HowToReg,
  player: Person,
} as const;

interface IconProps extends SvgIconProps {
  name: keyof typeof ICONS;
}

function Icon({ name, ...iconMappedProps }: IconProps) {
  const Component = ICONS[name];

  return <Component {...iconMappedProps} />;
}
