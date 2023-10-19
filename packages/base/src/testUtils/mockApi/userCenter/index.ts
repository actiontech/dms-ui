import {
  createSpySuccessResponse,
  MockSpyApy
} from '@actiontech/shared/lib/testUtil/mockApi';
import { userList, userGroupList, opPermissionList, roleList } from './data';
import dms from '@actiontech/shared/lib/api/base/service/dms';

class MockUserCenterApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getUserList();
    this.addUser();
    this.updateUser();
    this.deleteUser();
    this.getUserGroupList();
    this.addUserGroup();
    this.updateUserGroup();
    this.deleteUserGroup();
    this.getRoleList();
    this.addRole();
    this.updateRole();
    this.deleteRole();
    this.getOpPermissionsList();
  }

  public getUserList() {
    const spy = jest.spyOn(dms, 'ListUsers');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: userList.length,
        users: userList
      })
    );
    return spy;
  }

  public addUser() {
    const spy = jest.spyOn(dms, 'AddUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '123123'
      })
    );
    return spy;
  }

  public updateUser() {
    const spy = jest.spyOn(dms, 'UpdateUser');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteUser() {
    const spy = jest.spyOn(dms, 'DelUser');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getUserGroupList() {
    const spy = jest.spyOn(dms, 'ListUserGroups');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: userGroupList.length,
        user_groups: userGroupList
      })
    );
    return spy;
  }

  public addUserGroup() {
    const spy = jest.spyOn(dms, 'AddUserGroup');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        user_groups: {
          name: 'testGroup1',
          desc: '',
          user_uids: ['123']
        }
      })
    );
    return spy;
  }

  public updateUserGroup() {
    const spy = jest.spyOn(dms, 'UpdateUserGroup');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        user_group_uid: '1453',
        user_groups: {
          name: 'testGroup11',
          desc: '',
          user_uids: ['123']
        }
      })
    );
    return spy;
  }

  public deleteUserGroup() {
    const spy = jest.spyOn(dms, 'DelUserGroup');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        user_group_uid: '1453'
      })
    );
    return spy;
  }

  public getRoleList() {
    const spy = jest.spyOn(dms, 'ListRoles');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: roleList.length,
        roles: roleList
      })
    );
    return spy;
  }

  public addRole() {
    const spy = jest.spyOn(dms, 'AddRole');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '70023'
      })
    );
    return spy;
  }
  public updateRole() {
    const spy = jest.spyOn(dms, 'UpdateRole');
    spy.mockImplementation(() => createSpySuccessResponse(null));
    return spy;
  }
  public deleteRole() {
    const spy = jest.spyOn(dms, 'DelRole');
    spy.mockImplementation(() => createSpySuccessResponse(null));
    return spy;
  }

  public getOpPermissionsList() {
    const spy = jest.spyOn(dms, 'ListOpPermissions');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: opPermissionList.length,
        op_permissions: opPermissionList
      })
    );
    return spy;
  }
}

export default new MockUserCenterApi();
