import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import User from '@actiontech/shared/lib/api/base/service/User';
import { userOperationPermissionMockData } from './data';

class MockUserApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getUserOpPermission();
  }

  public getUserOpPermission() {
    const spy = jest.spyOn(User, 'GetUserOpPermission');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: userOperationPermissionMockData
      })
    );
    return spy;
  }
}

export default new MockUserApi();
