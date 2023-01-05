import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "../Dialog";
import { DialogTitle, DialogActions, Button } from "@mui/material";

const TermsOfUse = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Link
        className="text-white self-center hover:text-white hover:underline"
        to="#"
        onClick={() => setIsDialogOpen(true)}
      >
        Lire les conditions d'utilisation
      </Link>
      <Dialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        aria-labelledby="terms-use-title"
        aria-describedby="terms-use-description"
        actions={
          <Button
            color="primary"
            variant="contained"
            type="submit"
            sx={{ border: 1, borderColor: "secondary" }}
            onClick={() => setIsDialogOpen(false)}
          >
            Fermer
          </Button>
        }
      >
        Les conditions d’utilisation sont en cours de rédaction.
      </Dialog>
    </>
  );
};

export default TermsOfUse;
