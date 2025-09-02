import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { PayloadAction } from '@reduxjs/toolkit';

export const commonModalReducer = <
  T extends { modalStatus: ModalStatus }
>() => ({
  initModalStatus(
    state: T,
    { payload: { modalStatus } }: PayloadAction<{ modalStatus: ModalStatus }>
  ) {
    state.modalStatus = modalStatus;
  },
  updateModalStatus(
    state: T,
    {
      payload: { modalName, status }
    }: PayloadAction<{ modalName: string; status: boolean }>
  ) {
    if (Object.prototype.hasOwnProperty.call(state.modalStatus, modalName)) {
      state.modalStatus[modalName] = status;
    }
  }
});
