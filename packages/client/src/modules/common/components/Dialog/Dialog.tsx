import { Grid, Dialog as DialogMui, DialogContent } from "@mui/material";

import { CustomDialogActions, CustomGrid } from "./Dialog.styles";
import { useTranslation } from "../../../translations";
import { Button } from "../Button";

export { Dialog };

function Dialog({
  open,
  handleClose,
  children,
  content,
  actions,
  ariaLabelledBy,
  ariaDescribedBy,
}: {
  open: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}) {
  const { t } = useTranslation();

  return (
    <DialogMui
      open={open}
      onClose={handleClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <DialogContent>
        <CustomGrid>
          <Grid item md={2} flexShrink={0}>
            <img
              style={{ border: "2px solid white", borderRadius: "5px" }}
              src="/sage.png"
              alt="sage"
            />
          </Grid>
          <Grid item md={10}>
            {content || children}
          </Grid>
        </CustomGrid>
      </DialogContent>

      <CustomDialogActions>
        {actions || <Button onClick={handleClose}>{t("cta.close")}</Button>}
      </CustomDialogActions>
    </DialogMui>
  );
}
