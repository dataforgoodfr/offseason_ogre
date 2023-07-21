import { Grid, styled } from "@mui/material";
import { useCallback } from "react";
import { FormStatus } from "../models/form";
import { useTranslation } from "../../../translations/useTranslation";
import { useCurrentPlayer } from "../../context/hooks/player";
import { formatDate } from "../../../../lib/time";
import { Typography } from "../../../common/components/Typography";

export { FormStatusBanner };

function FormStatusBanner() {
  const { t } = useTranslation();
  const { profile } = useCurrentPlayer();

  const formatLastUpdateDate = useCallback(
    (date: string) => {
      if (!date) {
        return t("page.player.personalization-form.update-status.no-update");
      }

      return formatDate(date, "date-at-time");
    },
    [t]
  );

  if (!profile || !profile.status) {
    return null;
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      sx={{
        border: `3px solid white`,
        borderRadius: 2,
        p: 3,
      }}
    >
      <ItemText>
        <ItemTitle as="span">
          {t("page.player.personalization-form.form-status")}
        </ItemTitle>{" "}
        : {t(`form.status.${profile.status as FormStatus}`)}
      </ItemText>
      <ItemText>
        <ItemTitle as="span">
          {t(`form.last-action.${profile.status as FormStatus}`)}
        </ItemTitle>{" "}
        : {formatLastUpdateDate(profile.lastStatusUpdate)}
      </ItemText>
    </Grid>
  );
}

const Text = styled(Typography)(() => ({
  color: "white",
}));

const ItemTitle = styled(Text)(() => ({
  textDecoration: "underline",
}));

const ItemText = styled(Text)(() => ({}));
