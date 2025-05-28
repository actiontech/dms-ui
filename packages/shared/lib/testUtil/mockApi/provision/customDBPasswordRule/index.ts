import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import customDBPasswordRule from '../../../../api/provision/service/custom_db_password_rule';
import { mockCustomDBPasswordRuleData } from './data';

class MockCustomDBPasswordRuleApi implements MockSpyApy {
  public mockAllApi(): void {
    this.authGetCustomDBPasswordRule();
    this.authUpdateCustomDBPasswordRule();
  }

  public authGetCustomDBPasswordRule() {
    const spy = jest.spyOn(customDBPasswordRule, 'AuthGetCustomDBPasswordRule');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockCustomDBPasswordRuleData
      })
    );
    return spy;
  }

  public authUpdateCustomDBPasswordRule() {
    const spy = jest.spyOn(
      customDBPasswordRule,
      'AuthUpdateCustomDBPasswordRule'
    );
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockCustomDBPasswordRuleApi();
