import system from '../../../../api/sqle/service/system';
import { MockSpyApy, createSpySuccessResponse } from '../../common';

class SystemMockApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getSystemModuleStatus();
  }

  public getSystemModuleStatus() {
    const spy = jest.spyOn(system, 'getSystemModuleStatus');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_supported: true
        }
      })
    );
    return spy;
  }
}

export default new SystemMockApi();
