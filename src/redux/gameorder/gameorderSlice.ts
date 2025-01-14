import { createSlice} from '@reduxjs/toolkit';

const initialState = {
  dragedGameData:[]
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
      setDragedData: (state, action) => { 
        state.dragedGameData = action.payload
      }
    }
});

export const {setDragedData} = gameSlice.actions;
export default gameSlice.reducer;