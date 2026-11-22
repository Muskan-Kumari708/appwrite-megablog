import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : null,
    userData : null
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
        login: (state,action)=>{
            const userData = action.payload?.userData ?? action.payload;
            state.userData = userData ?? null;
            state.status = Boolean(userData);

        },

        logout: (state)=>{
            state.status = false;
            state.userData = null;
        },

        authUnavailable: (state)=>{
            state.status = null;
            state.userData = null;
        }
    }
})
export const {login,logout,authUnavailable} = authSlice.actions;

export default authSlice.reducer;
