import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import auth from '../../../api/auth';

class MockLoginApi implements MockSpyApy {
  public mockAllApi(): void {
    this.login();
  }

  public login() {
    const spy = jest.spyOn(auth, 'V1Login');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          code: 0,
          message: 'ok',
          token: 'login',
          user_id: 1
        }
      })
    );
    return spy;
  }
}

export default new MockLoginApi();
