import {
  Box,
  BoxProps,
  MobileStepper,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { MAX_NUMBER_STEPS, STEPS } from "../../../play";

const GameStepper = ({
  step,
  typographyProps = {},
  ...props
}: { step: number; typographyProps?: TypographyProps } & BoxProps) => {
  return (
    <Box {...props}>
      <Typography textAlign="center" {...typographyProps}>
        {computeStepperTitle(step)}
      </Typography>
      <StyledStepper step={step} />
    </Box>
  );
};

function computeStepperTitle(step: number) {
  if (step === 0) {
    return "Situation initiale";
  }
  if (step === STEPS.length - 1) {
    return "Synthèse";
  }
  return `Étape nº${step}`;
}

function StyledStepper({ step }: { step: number }) {
  const theme = useTheme();

  return (
    <MobileStepper
      variant="progress"
      steps={MAX_NUMBER_STEPS + 1}
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
