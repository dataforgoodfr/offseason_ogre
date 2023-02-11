import { useCallback } from "react";
import { Grid, Typography, useTheme } from "@mui/material";
import { FormStatus } from "../models/form";
import { usePlay } from "../../context/playContext";
import { useTranslation } from "../../../translations/useTranslation";

export { FormStatusBanner };

function FormStatusBanner() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { profile } = usePlay();

  const formatLastUpdateDate = useCallback((date: Date) => {
    if (!date) {
      return "Aucune action enregistrée";
    }

    const dateObj = new Date(date);
    const day = dateObj.toLocaleDateString([], {
      dateStyle: "short",
    });
    const time = new Date(date).toLocaleTimeString([], {
      timeStyle: "short",
    });

    return `le ${day} à ${time}`;
  }, []);

  if (!profile || !profile.status) {
    return null;
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{
        border: `3px solid ${theme.palette.primary.contrastText}`,
        borderRadius: 2,
        p: 3,
        width: "fit-content",
      }}
    >
      <Typography
        sx={{
          color: theme.palette.primary.contrastText,
          fontSize: "20px",
        }}
      >
        <Typography component="span" sx={{ textDecoration: "underline" }}>
          État du formulaire:
        </Typography>{" "}
        {t(`form.status.${profile.status as FormStatus}`)}
      </Typography>
      <Typography
        sx={{
          color: theme.palette.primary.contrastText,
          fontSize: "20px",
        }}
      >
        <Typography component="span" sx={{ textDecoration: "underline" }}>
          {t(`form.last-action.${profile.status as FormStatus}`)}:
        </Typography>{" "}
        {formatLastUpdateDate(profile.lastStatusUpdate)}
      </Typography>
    </Grid>
  );
}
