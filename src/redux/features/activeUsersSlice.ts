import { CurrentGame, PlayerData } from '@/utils/Types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveUsersState {
    users: Record<string, PlayerData>;
    gameCategories: Record<string, { gameName: string; players: string[] }>
}

const initialState: ActiveUsersState = {
    users: {},
    gameCategories: {}
}

const activeUsersSlice = createSlice({
    name: 'activeUsers',
    initialState,
    reducers: {
        addPlayer(state, action: PayloadAction<PlayerData>) {
            state.users[action.payload.playerId] = action.payload;
        },
        removePlayer(state, action: PayloadAction<{ playerId: string }>) {
            delete state.users[action.payload.playerId];
        },
        enterGame(state, action: PayloadAction<CurrentGame>) {
            const { playerId, gameId, gameName } = action.payload;
            if (state.users[playerId]) {
                state.users[playerId].currentGame = action.payload;
                if (!state.gameCategories[gameId]) {
                    state.gameCategories[gameId] = { gameName, players: [] };
                }
                if (!state.gameCategories[gameId].players.includes(playerId)) {
                    state.gameCategories[gameId].players.push(playerId);
                }
            }
        },
        exitGame(state, action: PayloadAction<{ playerId: string; gameId: string }>) {
            const { playerId, gameId } = action.payload
            if (state.users[playerId]) {
                state.users[playerId].currentGame = null
            }
            if (state.gameCategories[gameId]) {
                state.gameCategories[gameId].players = state.gameCategories[gameId].players.filter((id) => id !== playerId)
                if (state.gameCategories[gameId].players.length === 0) {
                    delete state.gameCategories[gameId]
                }
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
        categorizeByGame(state) {
            state.gameCategories = {}
            Object.values(state.users).forEach((user) => {
                if (user.currentGame) {
                    const { gameId, gameName } = user.currentGame
                    if (!state.gameCategories[gameId]) {
                        state.gameCategories[gameId] = { gameName, players: [] }
                    }
                    if (!state.gameCategories[gameId].players.includes(user.playerId)) {
                        state.gameCategories[gameId].players.push(user.playerId)
                    }
                }
            })
        },
    },
});

export const { addPlayer, removePlayer, enterGame, updateSpin, exitGame, categorizeByGame } = activeUsersSlice.actions;
export default activeUsersSlice.reducer;