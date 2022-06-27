import { Players } from "../../users/types";

export type { Action, PlayerActions };

interface Action {
    id: number;
    name: string;
    step: number;
    points: number;
    cost: number;
    category: string;
}

interface PlayerActions {
    player: Players;
    action: Action[];
}
