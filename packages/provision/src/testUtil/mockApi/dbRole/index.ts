import dbRole from '@actiontech/shared/lib/api/provision/service/db_role';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockDBRoleTips } from './data';

class MockAuthApi implements MockSpyApy {
  public mockAllApi(): void {
    this.authListDBRoleTips();
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
}

export default new MockAuthApi();
