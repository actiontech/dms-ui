import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { commonModalReducer } from '../common';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import { IGateway } from '@actiontech/shared/lib/api/base/service/common';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';

type AvailabilityZoneReduxState = {
  modalStatus: ModalStatus;
  selectAvailabilityZone: IGateway | null;
  availabilityZoneTips: IUidWithName[];
  // memorizedAvailabilityZone: IUidWithName | undefined;
  // recentlySelectedZoneRecord: IUidWithName[];
};

const initialState: AvailabilityZoneReduxState = {
  modalStatus: {},
  selectAvailabilityZone: null,
  availabilityZoneTips: []
  // memorizedAvailabilityZone: undefined,
  // recentlySelectedZoneRecord: []
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
    // updateMemorizedAvailabilityZone(
    //   state,
    //   {
    //     payload: { memorizedAvailabilityZone }
    //   }: PayloadAction<{ memorizedAvailabilityZone: IUidWithName | undefined }>
    // ) {
    //   state.memorizedAvailabilityZone = memorizedAvailabilityZone;
    // },
    // updateRecentlySelectedZoneRecord(
    //   state,
    //   {
    //     payload: { recentlySelectedZoneRecord }
    //   }: PayloadAction<{ recentlySelectedZoneRecord: IUidWithName[] }>
    // ) {
    //   state.recentlySelectedZoneRecord = recentlySelectedZoneRecord;
    // },
    ...commonModalReducer()
  }
});

export const {
  updateSelectAvailabilityZone,
  initModalStatus: initAvailabilityZoneModalStatus,
  updateModalStatus: updateAvailabilityZoneModalStatus,
  updateAvailabilityZoneTips
  // updateMemorizedAvailabilityZone,
  // updateRecentlySelectedZoneRecord
} = dmsAvailabilityZone.actions;

export default dmsAvailabilityZone.reducer;
