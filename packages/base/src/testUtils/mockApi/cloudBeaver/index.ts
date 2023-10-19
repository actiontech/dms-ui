import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { disableSqlQueryUrlData } from './data';
import cloudbeaver from '@actiontech/shared/lib/api/base/service/cloudbeaver';

class MockCloudBeaverApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getSqlQueryUrl();
  }

  public getSqlQueryUrl() {
    const spy = jest.spyOn(cloudbeaver, 'GetSQLQueryConfiguration');
    spy.mockImplementation(() =>
      createSpySuccessResponse(disableSqlQueryUrlData)
    );
    return spy;
  }
}

export default new MockCloudBeaverApi();
