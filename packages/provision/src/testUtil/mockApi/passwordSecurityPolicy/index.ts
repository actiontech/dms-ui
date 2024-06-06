import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import passwordSecurityPolicy from '@actiontech/shared/lib/api/provision/service/password_secury_policy/index';
import { passwordSecurityPolicyMockData } from './data';

class MockAuthApi implements MockSpyApy {
  public mockAllApi(): void {
    this.authListPasswordSecurityPolicies();
  }

  public authListPasswordSecurityPolicies() {
    const spy = jest.spyOn(
      passwordSecurityPolicy,
      'AuthListPasswordSecurityPolicys'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: passwordSecurityPolicyMockData,
        total_nums: passwordSecurityPolicyMockData.length
      })
    );
    return spy;
  }
}

export default new MockAuthApi();
