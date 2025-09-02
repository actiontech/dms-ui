import userManagement, {
  initUserManagementModalStatus,
  updateUserManagementModalStatus,
  updateSelectUserData,
  updateSelectRoleData,
  updatePermissionRoleId
} from '.';
import {
  roleListData,
  userListData
} from '../../testUtils/mockApi/userManagement/data';

const initStore = {
  modalStatus: {},
  selectUserData: null,
  selectRoleData: null,
  permissionRoleId: undefined
};

describe('store/userManagement', () => {
  test('should create action', () => {
    expect(
      initUserManagementModalStatus({ modalStatus: { test: true } })
    ).toEqual({
      payload: {
        modalStatus: {
          test: true
        }
      },
      type: 'userManagement/initModalStatus'
    });
    expect(
      updateUserManagementModalStatus({ modalName: 'test', status: false })
    ).toEqual({
      payload: {
        modalName: 'test',
        status: false
      },
      type: 'userManagement/updateModalStatus'
    });
    expect(updateSelectUserData(null)).toEqual({
      payload: null,
      type: 'userManagement/updateSelectUserData'
    });
    expect(updateSelectRoleData(null)).toEqual({
      payload: null,
      type: 'userManagement/updateSelectRoleData'
    });
    expect(updatePermissionRoleId(undefined)).toEqual({
      payload: undefined,
      type: 'userManagement/updatePermissionRoleId'
    });
  });

  test('should update select user data', async () => {
    const store = { ...initStore };
    const newStore = userManagement(
      store,
      updateSelectUserData(userListData[0])
    );
    expect(newStore).not.toBe(store);
    expect(newStore.selectUserData).toEqual(userListData[0]);
  });

  test('should update select role data', () => {
    const store = { ...initStore };
    const newStore = userManagement(
      store,
      updateSelectRoleData(roleListData[0])
    );
    expect(newStore).not.toBe(store);
    expect(newStore.selectRoleData).toEqual(roleListData[0]);
  });

  test('should update permission role id', () => {
    const store = { ...initStore };
    const newStore = userManagement(store, updatePermissionRoleId('10000'));
    expect(newStore).not.toBe(store);
    expect(newStore.permissionRoleId).toEqual('10000');
  });
});
