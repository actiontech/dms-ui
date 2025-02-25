import {
  createSpySuccessResponse,
  MockSpyApy
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockSendCodeData, mockVerifyCodeData } from './data';
import { SMSService } from '@actiontech/shared/lib/api/base';

class MockSMSApi implements MockSpyApy {
  public mockAllApi(): void {
    this.sendSmsCode();
    this.verifySmsCode();
  }

  public sendSmsCode() {
    const spy = jest.spyOn(SMSService, 'SendSmsCode');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockSendCodeData
      })
    );
    return spy;
  }

  public verifySmsCode() {
    const spy = jest.spyOn(SMSService, 'VerifySmsCode');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockVerifyCodeData
      })
    );
    return spy;
  }
}

export default new MockSMSApi();
