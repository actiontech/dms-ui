import service from '../../../../api/provision/service/service';
import { MockSpyApy, createSpySuccessResponse } from '../../../mockApi';
import { mockDatabaseAccountMeta } from './data';

class MockAuthApi implements MockSpyApy {
  public mockAllApi(): void {
    this.authGetDBAccountMeta();
  }

  public authGetDBAccountMeta() {
    const spy = jest.spyOn(service, 'AuthGetDBAccountMeta');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          db_account_metas: mockDatabaseAccountMeta
        }
      })
    );
    return spy;
  }
}

export default new MockAuthApi();
