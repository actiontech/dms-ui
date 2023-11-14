import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { IListProject } from '@actiontech/shared/lib/api/base/service/common';

type ProjectReduxState = {
  modalStatus: ModalStatus;
  selectProject: IListProject | null;
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
      { payload: { project } }: PayloadAction<{ project: IListProject | null }>
    ) {
      state.selectProject = project;
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
