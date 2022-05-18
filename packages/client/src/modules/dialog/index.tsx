import { Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useState } from "react";

// export { ErrorAlert, SuccessAlert, AlertSnackbar };

export default function AlertDialog(
    { message }: { message: string },
    // { variant }: { variant: typeof variant },
    // { color }: { color: typeof color }
) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>
                <RocketLaunchIcon sx={{ height: "1rem" }} />
                {message}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Lancer la partie ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Êtes-vous sûr.e de vouloir lancer l’atelier ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleClose} autoFocus>
                        Continuer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
