import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LunchDiningRoundedIcon from "@mui/icons-material/LunchDiningRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import DryCleaningRoundedIcon from "@mui/icons-material/DryCleaningRounded";

import {
    Grid,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
    SvgIconTypeMap,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { PlayBox } from "../Components";
import { ActionsHeader } from "./ActionsHeader";

export { Actions };

function Actions() {
    return (
        <PlayBox>
            <ActionsHeader />
            <AccordionLayout title="Passer au véhicule électrique" TitleIcon={PersonPinRoundedIcon}>
                <Typography>Caractéristiques.</Typography>
            </AccordionLayout>
            <AccordionLayout title="Déplacement en voiture" TitleIcon={DirectionsCarRoundedIcon}>
                <Typography>Caractéristiques.</Typography>
            </AccordionLayout>
            <AccordionLayout title="Moins d'équipement numérique" TitleIcon={HomeRoundedIcon}>
                <Typography>Caractéristiques.</Typography>
            </AccordionLayout>
            <AccordionLayout title="Arrêt boissons canettes" TitleIcon={LunchDiningRoundedIcon}>
                <Typography>Caractéristiques.</Typography>
            </AccordionLayout>
            <AccordionLayout title="Acheter moins de vêtements" TitleIcon={ComputerRoundedIcon}>
                <Typography>Caractéristiques.</Typography>
            </AccordionLayout>
        </PlayBox>
    );
}

function AccordionLayout({
    children,
    title,
    TitleIcon,
}: {
    children: JSX.Element;
    title: string;
    TitleIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    };
}) {
    const theme = useTheme();

    return (
        <Accordion
            sx={{
                mb: 2,
                borderRadius: "5px",
                border: "3px solid #F9C74F",
            }}
        >
            <AccordionSummary
                expandIcon={<ArrowForwardIosIcon />}
                aria-controls="infobh-content"
                id="infobh-header"
                sx={{
                    backgroundColor: (theme) => theme.palette.primary.main,
                    "& .MuiAccordionSummary-expandIconWrapper": {
                        color: "white",
                    },
                    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                        transform: "rotate(90deg)",
                    },
                    "& .MuiAccordionSummary-content": {
                        color: "white",
                    },
                }}
            >
                <Typography alignItems="center" display="flex" variant="h6">
                    {TitleIcon && <TitleIcon sx={{ mr: 1 }} />}
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails
                sx={{ pt: 2, bgcolor: theme.palette.primary.main, color: "white" }}
            >
                {children}
            </AccordionDetails>
        </Accordion>
    );
}
