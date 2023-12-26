import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import auth from '../../../api/auth';
import { roleListData, userListData, userScopeData } from './data';

class MockUserApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getUserInfo();
    this.getUserScope();
    this.getUserList();
    this.addRole();
    this.addUser();
    this.deleteRole();
    this.deleteUser();
    this.getRoleList();
    this.getScopeList();
    this.updateRole();
    this.updateUser();
  }

  public getUserInfo() {
    const spy = jest.spyOn(auth, 'V1GetUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: { role_id: 10000, user_id: 1, username: 'admin' }
      })
    );
    return spy;
  }

  public getUserScope() {
    const spy = jest.spyOn(auth, 'V1ListRoleScopes');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: userScopeData
      })
    );
    return spy;
  }

  public getUserList() {
    const spy = jest.spyOn(auth, 'V1ListUsers');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: userListData })
    );
    return spy;
  }

  public deleteUser() {
    const spy = jest.spyOn(auth, 'V1DeleteUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public addUser() {
    const spy = jest.spyOn(auth, 'V1CreateUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public updateUser() {
    const spy = jest.spyOn(auth, 'V1UpdateUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public getRoleList() {
    const spy = jest.spyOn(auth, 'V1ListRoles');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: roleListData
      })
    );
    return spy;
  }

  public addRole() {
    const spy = jest.spyOn(auth, 'V1CreateRole');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public updateRole() {
    const spy = jest.spyOn(auth, 'V1UpdateRole');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public deleteRole() {
    const spy = jest.spyOn(auth, 'V1DeleteRole');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        code: 0,
        message: 'ok'
      })
    );
    return spy;
  }

  public getScopeList() {
    const spy = jest.spyOn(auth, 'V1ListExistingScopes');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: userScopeData
      })
    );
    return spy;
  }
}

export default new MockUserApi();
