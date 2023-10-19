import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { IListProject } from '@actiontech/shared/lib/api/base/service/common';

type ProjectReduxState = {
  modalStatus: ModalStatus;
  selectProject: IListProject | null;
  currentProjectArchive: boolean;
};

const initialState: ProjectReduxState = {
  modalStatus: {},
  selectProject: null,
  currentProjectArchive: false
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
    updateCurrentProjectArchive(state, { payload }: PayloadAction<boolean>) {
      state.currentProjectArchive = payload;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectProject,
  updateCurrentProjectArchive,
  initModalStatus: initProjectModalStatus,
  updateModalStatus: updateProjectModalStatus
} = project.actions;

export default project.reducer;
