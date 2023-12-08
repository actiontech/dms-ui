import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import auth from '../../../api/auth';
import { userScopeData } from './data';

class MockUserApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getUserInfo();
    this.getUserScope();
  }

  public getUserInfo() {
    const spy = jest.spyOn(auth, 'V1GetUser');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        role_id: 10000,
        user_id: 1,
        username: 'admin'
      })
    );
    return spy;
  }

  public getUserScope() {
    const spy = jest.spyOn(auth, 'V1ListRoleScopes');
    spy.mockImplementation(() => createSpySuccessResponse(userScopeData));
    return spy;
  }
}

export default new MockUserApi();
