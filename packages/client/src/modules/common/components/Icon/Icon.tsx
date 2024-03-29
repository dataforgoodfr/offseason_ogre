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
  AccountCircle,
  Add,
  AdminPanelSettings,
  Badge,
  Bolt,
  Close,
  Computer,
  ConnectingAirports,
  ContentCopy,
  Delete,
  DirectionsCar,
  DoNotDisturb,
  DryCleaning,
  Edit,
  Event,
  HistoryEdu,
  Home,
  Key,
  LocalMovies,
  Lock,
  LockOpen,
  Logout,
  LunchDining,
  Microwave,
  North,
  PieChart,
  PlayArrow,
  RocketLaunch,
  Save,
  Shield,
  South,
  TipsAndUpdates,
  Train,
  Whatshot,
} from "@mui/icons-material";

export { Icon };
export type IconName = keyof typeof ICONS;

const ICONS = {
  "action-points": DirectionsBike,
  "access-time": AccessTimeIcon,
  "admin-panel": AdminPanelSettings,
  "admin-user": Shield,
  "arrow-back": ArrowBackIosIcon,
  "arrow-forward": ArrowForwardIosIcon,
  badge: Badge,
  "bar-chart": BarChartRoundedIcon,
  budget: Paid,
  car: DirectionsCar,
  "carbon-footprint": Cloud,
  "chart-pie": PieChart,
  "check-circle": CheckCircle,
  "check-doubled": DoneAll,
  clothes: DryCleaning,
  close: Close,
  computer: Computer,
  consumption: ShoppingCart,
  code: Key,
  copy: ContentCopy,
  create: Add,
  date: Event,
  draft: HistoryEdu,
  delete: Delete,
  edit: Edit,
  energy: Bolt,
  "form-draft": HistoryEdu,
  "form-pending-validation": SettingsSuggestIcon,
  "form-unfilled": Cancel,
  "form-validated": CheckCircle,
  food: LunchDining,
  helper: HelpIcon,
  house: Home,
  impactful: Whatshot,
  information: Info,
  "info-card": IconImgFactory({ asset: "info_icon.svg" }),
  launch: RocketLaunch,
  lock: Lock,
  "lock-open": LockOpen,
  logout: Logout,
  "mark-circle": Cancel,
  microwave: Microwave,
  missed: DoNotDisturb,
  "number-increase": North,
  "number-decrease": South,
  "open-in-new-tab": OpenInNew,
  plane: ConnectingAirports,
  play: PlayArrow,
  "player-finished": HowToReg,
  player: Person,
  "player-add": PersonAddIcon,
  "player-pin": PersonPinRounded,
  power: FlashOn,
  production: Factory,
  "rank-1st": IconImgFactory({ asset: "medal_1.png" }),
  "rank-2nd": IconImgFactory({ asset: "medal_2.png" }),
  "rank-3rd": IconImgFactory({ asset: "medal_3.png" }),
  save: Save,
  scenario: LocalMovies,
  settings: SettingsSuggestIcon,
  star: Star,
  synthesis: AutoGraphRoundedIcon,
  tips: TipsAndUpdates,
  team: Groups,
  train: Train,
  trophy: EmojiEvents,
  "user-account": AccountCircle,
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

type Asset = "info_icon.svg" | "medal_1.png" | "medal_2.png" | "medal_3.png";

function IconImgFactory({ asset }: { asset: Asset }) {
  return function IconImg({ width, height }: Omit<IconProps, "name"> = {}) {
    return <img src={`/${asset}`} alt="" width={width} height={height} />;
  };
}
