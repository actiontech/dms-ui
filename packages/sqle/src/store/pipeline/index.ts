import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { ModalName } from '../../data/ModalName';

type PipelineReduxState = {
  modalStatus: ModalStatus;
  selectPipelineId?: number;
  showPipelineNodeTour: boolean;
};

const initialState: PipelineReduxState = {
  selectPipelineId: undefined,
  showPipelineNodeTour: false,
  modalStatus: {
    [ModalName.Pipeline_Configuration_Detail_Modal]: false
  }
};

const pipeline = createSlice({
  name: 'pipeline',
  initialState,
  reducers: {
    updateSelectPipelineId(
      state,
      { payload: { id } }: PayloadAction<{ id?: number }>
    ) {
      state.selectPipelineId = id;
    },
    updatePipelineNodeTourStatus(
      state,
      { payload: { show } }: PayloadAction<{ show: boolean }>
    ) {
      state.showPipelineNodeTour = show;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectPipelineId,
  updatePipelineNodeTourStatus,
  initModalStatus: initPipelineModalStatus,
  updateModalStatus: updatePipelineModalStatus
} = pipeline.actions;

export default pipeline.reducer;
