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

// {
//     "type": "ENTERED_GAME",
//     "payload": {
//       "playerId": "anushaka",
//       "gameId": "SL-CRM",
//       "sessionId": "anushaka-SL-CRM-1729833447188",
//       "entryTime": "2024-10-25T05:17:27.188Z",
//       "exitTime": null,
//       "creditsAtEntry": 9646.04,
//       "creditsAtExit": 0,
//       "totalSpins": 0,
//       "totalBetAmount": 0,
//       "totalWinAmount": 0,
//       "spinData": [],
//       "sessionDuration": 0
//     }
//   }

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

// {
//     "playerId": "anushaka",
//     "managerName": "company007",
//     "initialCredits": 9646.04,
//     "currentCredits": 9646.04,
//     "entryTime": "2024-10-25T04:31:25.992Z",
//     "exitTime": null,
//     "currentRTP": 0,
//     "currentGame": {}
//   }

export interface PlayerData {
    playerId: string;
    status: string,
    managerName: string;
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


export function formatDate(dateString: string | null): string {
    if (!dateString) {
        return "Still Active"; // Handle null values by returning "Still Active"
    }

    const date = new Date(dateString); // Ensure dateString is valid before parsing

    return date.toLocaleDateString("en-GB", {
        weekday: "short", // Thu
        day: "numeric",   // 24
        month: "short",   // Oct
    }) + " " + date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true, // AM/PM format
    });
}

export const getTimeFromDate = (dateString: string | null): number => {
    return dateString ? new Date(dateString).getTime() : new Date(0).getTime();
};