import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { userTipListData } from './data';
import user from '@actiontech/shared/lib/api/sqle/service/user';

class MockUserApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getUserTip();
  }

  public getUserTip() {
    const spy = jest.spyOn(user, 'getUserTipListV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: userTipListData
      })
    );
    return spy;
  }
}

export default new MockUserApi();
