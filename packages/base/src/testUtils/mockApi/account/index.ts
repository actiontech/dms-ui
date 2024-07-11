import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import User from '@actiontech/shared/lib/api/base/service/User';

class MockAccountApi implements MockSpyApy {
  public mockAllApi(): void {
    this.updateCurrentUser();
    this.GenAccessToken();
  }

  public updateCurrentUser() {
    const spy = jest.spyOn(User, 'UpdateCurrentUser');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public GenAccessToken() {
    const spy = jest.spyOn(User, 'GenAccessToken');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockAccountApi();
