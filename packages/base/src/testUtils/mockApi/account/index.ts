import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

class MockAccountApi implements MockSpyApy {
  public mockAllApi(): void {
    this.updateCurrentUser();
  }

  public updateCurrentUser() {
    const spy = jest.spyOn(dms, 'UpdateCurrentUser');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockAccountApi();
