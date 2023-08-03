import {
  Box,
  BoxProps,
  MobileStepper,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { MAX_NUMBER_STEPS, STEPS } from "../../../play";
import { useTranslation } from "../../../translations";

const GameStepper = ({
  step,
  typographyProps = {},
  ...props
}: { step: number; typographyProps?: TypographyProps } & BoxProps) => {
  const { t } = useTranslation();

  return (
    <Box {...props}>
      <Typography textAlign="center" {...typographyProps}>
        {t(`step.${STEPS[step].id}.name`)}
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
