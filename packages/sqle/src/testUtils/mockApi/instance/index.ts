import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  instanceTipsMockData,
  instanceSchemasMockData,
  instanceInfoMockData
} from './data';

class InstanceMockApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getInstanceTipList();
    this.getInstance();
    this.getInstanceSchemas();
  }

  public getInstanceTipList() {
    const spy = jest.spyOn(instance, 'getInstanceTipListV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: instanceTipsMockData,
        total_nums: instanceTipsMockData.length
      })
    );
    return spy;
  }

  public getInstance() {
    const spy = jest.spyOn(instance, 'getInstanceV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: instanceInfoMockData
      })
    );
    return spy;
  }

  public getInstanceSchemas() {
    const spy = jest.spyOn(instance, 'getInstanceSchemasV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: { schema_name_list: instanceSchemasMockData }
      })
    );
    return spy;
  }
}

export default new InstanceMockApi();
