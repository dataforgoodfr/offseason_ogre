import { MobileStepper, useTheme } from "@mui/material";

const GameStepper = (props: any) => {
  const { step } = props;
  const theme = useTheme();

  return (
    <MobileStepper
      variant="progress"
      steps={7}
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
};

export default GameStepper;
