import Cloud from "@mui/icons-material/Cloud";
import DirectionsBike from "@mui/icons-material/DirectionsBike";
import Factory from "@mui/icons-material/Factory";
import FlashOn from "@mui/icons-material/FlashOn";
import Groups from "@mui/icons-material/Groups";
import HowToReg from "@mui/icons-material/HowToReg";
import Paid from "@mui/icons-material/Paid";
import Person from "@mui/icons-material/Person";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Warning from "@mui/icons-material/Warning";
import { SvgIconProps } from "@mui/material";

export { Icon };

const ICONS = {
  "action-points": DirectionsBike,
  budget: Paid,
  "carbon-footprint": Cloud,
  consumption: ShoppingCart,
  "player-finished": HowToReg,
  player: Person,
  power: FlashOn,
  production: Factory,
  team: Groups,
  warning: Warning,
} as const;

interface IconProps extends SvgIconProps {
  name: keyof typeof ICONS;
}

function Icon({ name, ...iconMappedProps }: IconProps) {
  const Component = ICONS[name];

  return <Component {...iconMappedProps} />;
}
