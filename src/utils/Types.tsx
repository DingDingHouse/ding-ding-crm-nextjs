export interface DeleteUserProps {
    deleteToken: () => void;
}

export interface SpinData {
    spinId: string;
    betAmount: number;
    winAmount: number;
    specialFeatures?: SpecialFeatures;
}

export interface SpecialFeatures {
    jackpot?: Jackpot;        // Jackpot details (optional, if triggered)
    scatter?: Scatter;        // Scatter details (optional, if triggered)
    bonus?: Bonus;            // Bonus game details (optional, if triggered)
}

export interface Jackpot {
    triggered: boolean;       // Whether the jackpot was triggered
    amountWon: number;        // Amount won from the jackpot
}

export interface Scatter {
    triggered: boolean;       // Whether scatter was triggered
    amountWon: number;        // Amount won from the scatter
}

export interface Bonus {
    triggered: boolean;        // Whether a bonus game was triggered
    bonusGameRounds: number;   // Number of bonus rounds played
    totalBonusWin: number;     // Total winnings from the bonus game
}


export interface CurrentGame {
    playerId: string,
    gameId: string,
    sessionId: string,
    entryTime: Date;
    exitTime: Date | null;
    creditsAtEntry: number;
    creditsAtExit: number;
    totalSpins: number;
    totalBetAmount: number;
    totalWinAmount: number;
    spinData: SpinData[]
    sessionDuration: number;
}


export interface PlayerData {
    playerId: string;
    managerName: string;
    status: string;  // "active", "inactive"
    initialCredits: number;
    currentCredits: number;
    entryTime: Date | null;
    exitTime: Date | null
    currentRTP: number;
    currentGame: CurrentGame | null;
}

export interface ActiveUsersState {
    users: Record<string, PlayerData>;
}

export enum EventType {
    ENTERED_PLATFORM = "ENTERED_PLATFORM",
    EXITED_PLATFORM = "EXITED_PLATFORM",
    ENTERED_GAME = "ENTERED_GAME",
    EXITED_GAME = "EXITED_GAME",
    GAME_SPIN = "HIT_SPIN",
    UPDATED_SPIN = "UPDATED_SPIN"
}
