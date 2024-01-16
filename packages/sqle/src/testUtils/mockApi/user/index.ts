import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

import user from '@actiontech/shared/lib/api/sqle/service/user';
import { UserTipListData } from './data';

class MockUserApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getUserTipList();
  }

  public getUserTipList() {
    const spy = jest.spyOn(user, 'getUserTipListV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: UserTipListData
      })
    );
    return spy;
  }
}

export default new MockUserApi();
