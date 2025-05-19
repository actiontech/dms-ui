import { createSpySuccessResponse, MockSpyApy } from '../../../mockApi';
import { GatewayService } from '../../../../api/base';
import { mockGatewayListData, mockGatewayTipsData } from './data';

class MockGatewayApi implements MockSpyApy {
  public mockAllApi(): void {
    this.listGateways();
    this.addGateway();
    this.getGatewayTips();
    this.getGateway();
    this.updateGateway();
    this.deleteGateway();
  }

  public listGateways() {
    const spy = jest.spyOn(GatewayService, 'ListGateways');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGatewayListData,
        total_nums: mockGatewayListData.length
      })
    );
    return spy;
  }

  public addGateway() {
    const spy = jest.spyOn(GatewayService, 'AddGateway');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getGatewayTips() {
    const spy = jest.spyOn(GatewayService, 'GetGatewayTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGatewayTipsData
      })
    );
    return spy;
  }

  public getGateway() {
    const spy = jest.spyOn(GatewayService, 'GetGateway');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockGatewayListData[0]
      })
    );
    return spy;
  }

  public updateGateway() {
    const spy = jest.spyOn(GatewayService, 'UpdateGateway');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteGateway() {
    const spy = jest.spyOn(GatewayService, 'DeleteGateway');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockGatewayApi();
