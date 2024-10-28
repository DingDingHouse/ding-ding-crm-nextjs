import { CurrentGame, PlayerData } from '@/utils/Types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveUsersState {
    users: Record<string, PlayerData>;
}

const initialState: ActiveUsersState = {
    users: {}
}

const activeUsersSlice = createSlice({
    name: 'activeUsers',
    initialState,
    reducers: {
        addPlayer(state, action: PayloadAction<PlayerData>) {
            const playerData = action.payload;
            state.users[playerData.playerId] = playerData;
        },
        removePlayer(state, action: PayloadAction<{ playerId: string }>) {
            delete state.users[action.payload.playerId];
        },
        enterGame(state, action: PayloadAction<CurrentGame>) {
            const { playerId } = action.payload;
            if (state.users[playerId]) {
                state.users[playerId].currentGame = action.payload;
            }
        },
        exitGame(state, action: PayloadAction<{ playerId: string }>) {
            if (state.users[action.payload.playerId]) {
                state.users[action.payload.playerId].currentGame = null;
            }
        },
        // Updated to handle full payload and avoid NaN issues
        updateSpin(state, action: PayloadAction<CurrentGame>) {
            const { playerId, ...updatedGameData } = action.payload;
            const user = state.users[playerId];
            if (user && user.currentGame) {
                // Update all fields from the payload to ensure proper synchronization
                user.currentGame = {
                    ...user.currentGame,
                    ...updatedGameData,
                    totalBetAmount: Number(updatedGameData.totalBetAmount || 0),
                    totalWinAmount: Number(updatedGameData.totalWinAmount || 0),
                    totalSpins: updatedGameData.totalSpins,
                    spinData: updatedGameData.spinData,
                };
            }
        },
    },
});

export const { addPlayer, removePlayer, enterGame, updateSpin, exitGame } = activeUsersSlice.actions;
export default activeUsersSlice.reducer;