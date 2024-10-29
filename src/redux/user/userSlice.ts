import { createSlice} from '@reduxjs/toolkit';

const initialState = {
        userCredit:0
}

export const UsersSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsercredit: (state, action) => {
            state.userCredit = action.payload
       }
    }
});

export const {setUsercredit} = UsersSlice.actions;
export default UsersSlice.reducer;