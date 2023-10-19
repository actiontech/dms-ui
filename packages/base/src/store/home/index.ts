import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type HomeReduxState = {
  userType: string;
};

const initialState: HomeReduxState = {
  userType: 'admin'
};

const home = createSlice({
  name: 'home',
  initialState,
  reducers: {
    updateUserType: (
      state,
      { payload: { userType } }: PayloadAction<{ userType: string }>
    ) => {
      state.userType = userType;
    }
  }
});

export const { updateUserType } = home.actions;

export default home.reducer;
