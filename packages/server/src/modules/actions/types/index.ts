import { Players } from "../../users/types";

export type { Action, PlayerActions };

interface Action {
    id?: number;
    name: string;
    step: number;
    points: number;
    cost: number;
}

interface PlayerActions {
    player: Players;
    action: Action[];
}
