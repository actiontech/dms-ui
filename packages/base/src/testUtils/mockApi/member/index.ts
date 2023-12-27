import {
  createSpySuccessResponse,
  MockSpyApy
} from '@actiontech/shared/lib/testUtil/mockApi';
import { memberGroupList, memberList } from './data';
import dms from '@actiontech/shared/lib/api/base/service/dms';

class MockMemberApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getMemberList();
    this.addMember();
    this.updateMember();
    this.deleteMember();
    this.getMemberGroupList();
    this.getMemberGroup();
    this.addMemberGroup();
    this.updateMemberGroup();
    this.deleteMemberGroup();
  }

  public getMemberList() {
    const spy = jest.spyOn(dms, 'ListMembers');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: memberList.length,
        data: memberList
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

  public getMemberGroupList() {
    const spy = jest.spyOn(dms, 'ListMemberGroups');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: memberGroupList })
    );
    return spy;
  }

  public addMemberGroup() {
    const spy = jest.spyOn(dms, 'AddMemberGroup');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: { id: '10023412' } })
    );
    return spy;
  }

  public getMemberGroup() {
    const spy = jest.spyOn(dms, 'GetMemberGroup');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: memberGroupList[0] })
    );
    return spy;
  }

  public updateMemberGroup() {
    const spy = jest.spyOn(dms, 'UpdateMemberGroup');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteMemberGroup() {
    const spy = jest.spyOn(dms, 'DeleteMemberGroup');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockMemberApi();
