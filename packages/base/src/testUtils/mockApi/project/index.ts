import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockProjectList } from './data';
import dms from '@actiontech/shared/lib/api/base/service/dms';

class MockProjectApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getProjectList();
    this.addProject();
    this.updateProject();
    this.deleteProject();
    this.archiveProject();
    this.unarchiveProject();
  }

  public getProjectList() {
    const spy = jest.spyOn(dms, 'ListProjects');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: mockProjectList.length,
        data: mockProjectList
      })
    );
    return spy;
  }

  public addProject() {
    const spy = jest.spyOn(dms, 'AddProject');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          uid: '123'
        }
      })
    );
    return spy;
  }

  public updateProject() {
    const spy = jest.spyOn(dms, 'UpdateProject');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteProject() {
    const spy = jest.spyOn(dms, 'DelProject');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public archiveProject() {
    const spy = jest.spyOn(dms, 'ArchiveProject');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          uid: '123'
        }
      })
    );
    return spy;
  }

  public unarchiveProject() {
    const spy = jest.spyOn(dms, 'UnarchiveProject');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          uid: '123'
        }
      })
    );
    return spy;
  }
}

export default new MockProjectApi();
