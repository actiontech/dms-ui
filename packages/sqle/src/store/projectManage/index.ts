import { createSlice } from '@reduxjs/toolkit';

type ProjectManageReduxState = {
  overviewRefreshFlag: boolean;
};

const initialState: ProjectManageReduxState = {
  overviewRefreshFlag: false
};

const projectManage = createSlice({
  name: 'projectManage',
  initialState,
  reducers: {
    refreshProjectOverview(state) {
      state.overviewRefreshFlag = !state.overviewRefreshFlag;
    }
  }
});

export const { refreshProjectOverview } = projectManage.actions;

export default projectManage.reducer;
