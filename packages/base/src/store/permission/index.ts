import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IGetUserOpPermissionReply } from '@actiontech/shared/lib/api/base/service/common';
import { ModuleFeatureSupportStatus } from '@actiontech/shared/lib/enum';

type PermissionState = {
  moduleFeatureSupport: ModuleFeatureSupportStatus;
  userOperationPermissions: IGetUserOpPermissionReply['data'] | null;
};

const initialState: PermissionState = {
  moduleFeatureSupport: {
    sqlOptimization: false
  },
  userOperationPermissions: null
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    updateModuleFeatureSupport(
      state,
      { payload }: PayloadAction<ModuleFeatureSupportStatus>
    ) {
      state.moduleFeatureSupport = payload;
    },
    updateUserOperationPermissions(
      state,
      { payload }: PayloadAction<IGetUserOpPermissionReply['data']>
    ) {
      state.userOperationPermissions = payload;
    }
  }
});

export const { updateModuleFeatureSupport, updateUserOperationPermissions } =
  permissionSlice.actions;

export default permissionSlice.reducer;
