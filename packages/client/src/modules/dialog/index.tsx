import { Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useState } from "react";

export default function AlertDialog(
    props: any
) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const launchGame = () => {
        if (props.gameStatus === "NOT_STARTED") {
            console.log("launch game !");
            setOpen(false);
        }
    }

    return (
        <div>
            <Button onClick={handleClickOpen}>
                <RocketLaunchIcon sx={{ height: "1rem" }} />
                Animer
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
                    <Button onClick={launchGame} autoFocus>
                        Continuer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
