import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import { IGateway } from '@actiontech/shared/lib/api/base/service/common';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';

type AvailabilityZoneReduxState = {
  modalStatus: ModalStatus;
  selectAvailabilityZone: IGateway | null;
  availabilityZoneTips: IUidWithName[];
};

const initialState: AvailabilityZoneReduxState = {
  modalStatus: {},
  selectAvailabilityZone: null,
  availabilityZoneTips: []
};

const dmsAvailabilityZone = createSlice({
  name: 'availabilityZone',
  initialState,
  reducers: {
    updateSelectAvailabilityZone(
      state,
      {
        payload: { availabilityZone }
      }: PayloadAction<{ availabilityZone: any }>
    ) {
      state.selectAvailabilityZone = availabilityZone;
    },
    updateAvailabilityZoneTips(
      state,
      {
        payload: { availabilityZoneTips }
      }: PayloadAction<{ availabilityZoneTips: IUidWithName[] }>
    ) {
      state.availabilityZoneTips = availabilityZoneTips;
    },
    ...commonModalReducer()
  }
});

export const {
  updateSelectAvailabilityZone,
  initModalStatus: initAvailabilityZoneModalStatus,
  updateModalStatus: updateAvailabilityZoneModalStatus,
  updateAvailabilityZoneTips
} = dmsAvailabilityZone.actions;

export default dmsAvailabilityZone.reducer;
