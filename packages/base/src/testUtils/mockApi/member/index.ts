import {
  createSpySuccessResponse,
  MockSpyApy
} from '@actiontech/shared/lib/testUtil/mockApi';
import { memberList } from './data';
import dms from '@actiontech/shared/lib/api/base/service/dms';

class MockMemberApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getMemberList();
    this.addMember();
    this.updateMember();
    this.deleteMember();
  }

  public getMemberList() {
    const spy = jest.spyOn(dms, 'ListMembers');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total: memberList.length,
        members: memberList
      })
    );
    return spy;
  }

  public addMember() {
    const spy = jest.spyOn(dms, 'AddMember');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        uid: '10029382'
      })
    );
    return spy;
  }

  public updateMember() {
    const spy = jest.spyOn(dms, 'UpdateMember');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteMember() {
    const spy = jest.spyOn(dms, 'DelMember');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockMemberApi();
