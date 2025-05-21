import { MockSpyApy, createSpySuccessResponse } from '../../common';
import user from '../../../../api/sqle/service/user';
import { userTipListData } from './data';

class MockUserApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getUserTipList();
  }

  public getUserTipList() {
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
