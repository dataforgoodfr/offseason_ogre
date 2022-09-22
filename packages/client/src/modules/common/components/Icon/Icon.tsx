import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

import Cancel from "@mui/icons-material/Cancel";
import Cloud from "@mui/icons-material/Cloud";
import CheckCircle from "@mui/icons-material/CheckCircle";
import DirectionsBike from "@mui/icons-material/DirectionsBike";
import DoneAll from "@mui/icons-material/DoneAll";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import Factory from "@mui/icons-material/Factory";
import FlashOn from "@mui/icons-material/FlashOn";
import Groups from "@mui/icons-material/Groups";
import HowToReg from "@mui/icons-material/HowToReg";
import HelpIcon from "@mui/icons-material/Help";
import Info from "@mui/icons-material/Info";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Paid from "@mui/icons-material/Paid";
import Person from "@mui/icons-material/Person";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Star from "@mui/icons-material/Star";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import Warning from "@mui/icons-material/Warning";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import { SvgIconProps } from "@mui/material";

export { Icon };

const ICONS = {
  "action-points": DirectionsBike,
  "arrow-forward": ArrowForwardIosIcon,
  "bar-chart": BarChartRoundedIcon,
  budget: Paid,
  "carbon-footprint": Cloud,
  "check-circle": CheckCircle,
  "check-doubled": DoneAll,
  consumption: ShoppingCart,
  helper: HelpIcon,
  information: Info,
  "mark-circle": Cancel,
  "open-in-new-tab": OpenInNew,
  "player-finished": HowToReg,
  player: Person,
  power: FlashOn,
  production: Factory,
  star: Star,
  synthesis: AutoGraphRoundedIcon,
  team: Groups,
  trophy: EmojiEvents,
  "videogame-controller": VideogameAssetRoundedIcon,
  warning: Warning,
} as const;

interface IconProps extends SvgIconProps {
  name: keyof typeof ICONS;
}

function Icon({ name, ...iconMappedProps }: IconProps) {
  const Component = ICONS[name];

  return <Component {...iconMappedProps} />;
}
