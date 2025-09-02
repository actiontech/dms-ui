import dbRole from '@actiontech/shared/lib/api/provision/service/db_role';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockDBRoleTips, mockDBRoleData, mockRoleDetailMockData } from './data';

class MockAuthApi implements MockSpyApy {
  public mockAllApi(): void {
    this.authListDBRoleTips();
    this.authListDBRole();
    this.authDelDBRole();
    this.authAddDBRole();
    this.authUpdateDBRole();
    this.authDBRoleDetail();
  }

  public authListDBRoleTips() {
    const spy = jest.spyOn(dbRole, 'AuthListDBRoleTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockDBRoleTips
      })
    );
    return spy;
  }

  public authListDBRole() {
    const spy = jest.spyOn(dbRole, 'AuthListDBRole');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockDBRoleData
      })
    );
    return spy;
  }

  public authDelDBRole() {
    const spy = jest.spyOn(dbRole, 'AuthDelDBRole');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public authAddDBRole() {
    const spy = jest.spyOn(dbRole, 'AuthAddDBRole');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public authUpdateDBRole() {
    const spy = jest.spyOn(dbRole, 'AuthUpdateDBRole');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public authDBRoleDetail() {
    const spy = jest.spyOn(dbRole, 'AuthDBRoleDetail');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockRoleDetailMockData
      })
    );
    return spy;
  }
}

export default new MockAuthApi();
