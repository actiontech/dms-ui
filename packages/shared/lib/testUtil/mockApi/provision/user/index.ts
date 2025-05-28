import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import User from '../../../../api/base/service/User';
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
