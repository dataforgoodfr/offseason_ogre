import { Box } from "@mui/material";
import { Typography } from "../Typography";
import { SliderStyled } from "./Slider.styles";

export { Slider };

const STEP = 0.01;

interface SliderProps {
  value: number;
  min: number;
  max: number;
  marks?: {
    label: string;
    value: number;
  }[];
  labelFormatter?: (value: number) => string;
  onChange: (value: number) => void;
  ariaLabel?: string;
}

function Slider({
  value,
  min,
  max,
  marks = [],
  labelFormatter = (value: number) => `${value}`,
  onChange,
  ariaLabel = "",
}: SliderProps) {
  return (
    <Box display="flex" alignItems="start" gap={2}>
      <Typography style={{ flex: "0 0 auto", marginTop: "5px" }}>
        {labelFormatter(min)}
      </Typography>
      <SliderStyled
        getAriaLabel={() => ariaLabel}
        getAriaValueText={labelFormatter}
        valueLabelDisplay="auto"
        value={value}
        min={min}
        max={max}
        step={STEP}
        marks={marks}
        onChange={(_, value) => onChange(value as number)}
      />
      <Typography style={{ flex: "0 0 auto", marginTop: "5px" }}>
        {labelFormatter(max)}
      </Typography>
    </Box>
  );
}
