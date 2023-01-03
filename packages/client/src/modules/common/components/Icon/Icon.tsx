import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Star from "@mui/icons-material/Star";
import VideogameAssetRoundedIcon from "@mui/icons-material/VideogameAssetRounded";
import Warning from "@mui/icons-material/Warning";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import { SvgIconProps } from "@mui/material";
import PersonPinRounded from "@mui/icons-material/PersonPinRounded";
import {
  Badge,
  Close,
  Computer,
  ConnectingAirports,
  ContentCopy,
  DirectionsCar,
  DryCleaning,
  HistoryEdu,
  Home,
  Lock,
  LockOpen,
  LunchDining,
  Microwave,
  TipsAndUpdates,
  Train,
} from "@mui/icons-material";

export { Icon };

const ICONS = {
  "action-points": DirectionsBike,
  "access-time": AccessTimeIcon,
  "arrow-back": ArrowBackIosIcon,
  "arrow-forward": ArrowForwardIosIcon,
  badge: Badge,
  "bar-chart": BarChartRoundedIcon,
  budget: Paid,
  car: DirectionsCar,
  "carbon-footprint": Cloud,
  "check-circle": CheckCircle,
  "check-doubled": DoneAll,
  clothes: DryCleaning,
  close: Close,
  computer: Computer,
  consumption: ShoppingCart,
  copy: ContentCopy,
  draft: HistoryEdu,
  food: LunchDining,
  helper: HelpIcon,
  house: Home,
  information: Info,
  lock: Lock,
  "lock-open": LockOpen,
  "mark-circle": Cancel,
  microwave: Microwave,
  "open-in-new-tab": OpenInNew,
  plane: ConnectingAirports,
  "player-finished": HowToReg,
  player: Person,
  "player-add": PersonAddIcon,
  "player-pin": PersonPinRounded,
  power: FlashOn,
  production: Factory,
  settings: SettingsSuggestIcon,
  star: Star,
  synthesis: AutoGraphRoundedIcon,
  tips: TipsAndUpdates,
  team: Groups,
  train: Train,
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

export type IconName = keyof typeof ICONS;
