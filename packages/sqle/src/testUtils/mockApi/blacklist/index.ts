import blacklist from '@actiontech/shared/lib/api/sqle/service/blacklist';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockBlacklistData, mockBlacklistDetailData } from './data';

class AuditWhiteList implements MockSpyApy {
  public mockAllApi(): void {
    this.getBlacklist();
    this.getBlacklistByID();
    this.deleteBlackList();
    this.createBlacklist();
    this.updateBlacklist();
  }

  public getBlacklist() {
    const spy = jest.spyOn(blacklist, 'getBlacklistV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockBlacklistData
      })
    );
    return spy;
  }

  public getBlacklistByID() {
    const spy = jest.spyOn(blacklist, 'getBlacklistByIDV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockBlacklistDetailData
      })
    );
    return spy;
  }

  public deleteBlackList() {
    const spy = jest.spyOn(blacklist, 'deleteBlackList');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public createBlacklist() {
    const spy = jest.spyOn(blacklist, 'createBlacklistV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          blacklist_id: 42
        }
      })
    );
    return spy;
  }

  public updateBlacklist() {
    const spy = jest.spyOn(blacklist, 'updateBlacklistV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new AuditWhiteList();
