import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import { IListProjectV2 } from '@actiontech/shared/lib/api/base/service/common';

type ProjectReduxState = {
  modalStatus: ModalStatus;
  selectProject: IListProjectV2 | null;
};

const initialState: ProjectReduxState = {
  modalStatus: {},
  selectProject: null
};

const project = createSlice({
  name: 'project',
  initialState,
  reducers: {
    updateSelectProject(
      state,
      {
        payload: { selectProject }
      }: PayloadAction<{ selectProject: IListProjectV2 | null }>
    ) {
      state.selectProject = selectProject;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectProject,
  initModalStatus: initProjectModalStatus,
  updateModalStatus: updateProjectModalStatus
} = project.actions;

export default project.reducer;
