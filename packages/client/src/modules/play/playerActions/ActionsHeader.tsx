import {
    Grid,
    Typography,
} from "@mui/material";

import { Box, Rating } from "@mui/material";
import { ITeamWithPlayers, IUser } from "../../../utils/types";
import { PlayBox } from "../Components";

import HelpIcon from '@mui/icons-material/Help';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from "@mui/icons-material/Paid";
import CloudIcon from "@mui/icons-material/Cloud";
import StarIcon from "@mui/icons-material/Star";
import { MAX_ACTION_POINTS } from "../constants";
import { useCurrentPersona } from "../context/playContext";
import { useAuth } from "../../auth/authProvider";
import { useMyTeam, usePlay } from "../context/playContext";
import { stages } from "../../stages"

interface IPlayer {
    gameId: number;
    teamId: number;
    userId: number;
    user: IUser;
}

export { ActionsHeader };

function GetCurrentStageData() {
    const { game } = usePlay();
    const currentStage = stages.filter(stage => stage.step === game.step)[0];
    return currentStage;
}

function ActionsHeader() {
    const persona = useCurrentPersona();
    const currentStage = GetCurrentStageData();
    return (
        <Box mt={2} mb={2}>
            <Box display="flex" alignItems="center">
                <ShoppingCartIcon />
                <Typography ml={1} mr={2} variant="h5">{currentStage.title}</Typography>
                <HelpIcon />
            </Box>
            <Box display="flex" alignItems="center" mt={1}>
                <PaidIcon />
                <Typography
                    ml={1}
                >{`Budget restant: ${persona.budget} €/j`}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={1}>
                <CloudIcon />
                <Typography
                    ml={1}
                >{`Bilan carbone: ${persona.carbonFootprint} kgCO2/an`}</Typography>
            </Box>
            <ActionPoints />
        </Box>
    );
}

function ActionPoints() {
    const persona = useCurrentPersona();
    const currentStage = GetCurrentStageData();
    return (
        <Box display="flex" alignItems="center" mt={1}>
            <Typography>PA utilisés:</Typography>
            <Rating
                emptyIcon={
                    <StarIcon style={{ fill: "grey", opacity: 0.5 }} fontSize="inherit" />
                }
                max={currentStage.available_points}
                name="action-points"
                readOnly
                value={currentStage.available_points - persona.points}
            />
        </Box>
    );
}
