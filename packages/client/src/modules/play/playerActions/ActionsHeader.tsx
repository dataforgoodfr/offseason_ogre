import {
    Grid,
    Typography,
} from "@mui/material";

export { ActionsHeader };

function ActionsHeader() {
    return (
        <Grid container direction="column">
            <Grid item>
                <Typography variant="h5">Choix de consommation 1</Typography>
            </Grid>
            <Grid item>
                Budget restant :
            </Grid>
            <Grid item>
                PA utilisés :
            </Grid>
            {/* <Typography
        sx={{ textAlign: "center", mb: 2 }} variant="h3"
        >
        </Typography> */}
        </Grid>
    );
}