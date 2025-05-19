import { createSpySuccessResponse, MockSpyApy } from '../../../mockApi';
import { mockSendCodeData, mockVerifyCodeData } from './data';
import { SMSService } from '../../../../api/base';

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
