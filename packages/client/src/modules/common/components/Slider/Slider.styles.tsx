import { styled } from "@mui/material/styles";
import Slider from "@mui/material/Slider";

export { SliderStyled };

const SLIDER_HEIGHT = 8;
const SLIDER_THUMB_SIZE = 24;

const SliderStyled = styled(Slider)(({ theme }) => ({
  color: theme.palette.secondary.main,
  height: SLIDER_HEIGHT,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: SLIDER_THUMB_SIZE,
    width: SLIDER_THUMB_SIZE,
    backgroundColor: theme.palette.secondary.main,
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: theme.palette.secondary.main,
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
  ".MuiSlider-mark": {
    width: "2px",
    height: SLIDER_HEIGHT,
  },
  ".MuiSlider-markLabel": {
    color: theme.palette.secondary.main,
  },
}));
