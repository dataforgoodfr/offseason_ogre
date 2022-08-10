import Button from "@mui/material/Button";
import { Grid, Dialog as DialogMui, DialogContent } from "@mui/material";

import { CustomDialogActions, CustomGrid } from "./Dialog.styles";

export { Dialog };

function Dialog({
  open,
  handleClose,
  children,
  actions,
  ariaLabelledBy,
  ariaDescribedBy,
}: {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}) {
  return (
    <DialogMui
      open={open}
      onClose={handleClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <DialogContent>
        <CustomGrid>
          <Grid item xs={12} md={2}>
            <img
              style={{ border: "2px solid white", borderRadius: "5px" }}
              src="/sage.png"
              alt="sage"
            />
          </Grid>
          <Grid item xs={12} md={10}>
            {children}
          </Grid>
        </CustomGrid>
      </DialogContent>

      {
        <CustomDialogActions>
          {actions || (
            <Button
              color="primary"
              variant="contained"
              onClick={handleClose}
              type="button"
            >
              Fermer
            </Button>
          )}
        </CustomDialogActions>
      }
    </DialogMui>
  );
}
