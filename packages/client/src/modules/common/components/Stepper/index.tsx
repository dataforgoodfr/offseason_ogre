import {
  Box,
  BoxProps,
  MobileStepper,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { MAX_NUMBER_STEPS } from "../../../play";

const GameStepper = ({
  step,
  typographyProps = {},
  ...props
}: { step: number; typographyProps?: TypographyProps } & BoxProps) => {
  return (
    <Box {...props}>
      <Typography textAlign="center" {...typographyProps}>
        {step === 0 ? "Situation initiale" : `Etape nº${step}`}
      </Typography>
      <StyledStepper step={step} />
    </Box>
  );
};

function StyledStepper({ step }: { step: number }) {
  const theme = useTheme();

  return (
    <MobileStepper
      variant="progress"
      steps={MAX_NUMBER_STEPS}
      position="static"
      activeStep={step}
      sx={{
        maxWidth: "100%",
        flexGrow: 1,
        mt: 1,
        mb: 1,
        backgroundColor: theme.palette.primary.main,
        justifyContent: "center",
        "& .MuiMobileStepper-progress": {
          width: "75%",
        },
        "& .MuiLinearProgress-colorPrimary": {
          bgcolor: "red",
        },
        "& .MuiLinearProgress-barColorPrimary": {
          bgcolor: "green",
        },
      }}
      nextButton={<></>}
      backButton={<></>}
    />
  );
}

export default GameStepper;
