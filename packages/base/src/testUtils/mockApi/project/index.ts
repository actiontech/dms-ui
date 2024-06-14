import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  mockProjectList,
  mockPreviewImportProjects,
  mockProjectTips,
  mockBatchImportDBCheckData,
  mockDbServicesConnectionData
} from './data';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { AxiosResponse } from 'axios';
import { MIMETypeEnum } from '@actiontech/shared/lib/enum';

class MockProjectApi implements MockSpyApy {
  public mockAllApi(): void {
    this.getProjectList();
    this.addProject();
    this.updateProject();
    this.deleteProject();
    this.archiveProject();
    this.unarchiveProject();
    this.exportProjects();
    this.importProjects();
    this.getImportProjectsTemplate();
    this.previewImportProjects();
    this.getProjectTips();
    this.importDBServicesOfProjects();
    this.importDBServicesOfOneProject();
    this.getImportDBServicesTemplate();
    this.importDBServicesOfProjectsCheck();
    this.importDBServicesOfOneProjectCheck();
    this.dbServicesConnection();
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

  public exportProjects() {
    const spy = jest.spyOn(dms, 'ExportProjects');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public importProjects() {
    const spy = jest.spyOn(dms, 'ImportProjects');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getImportProjectsTemplate() {
    const spy = jest.spyOn(dms, 'GetImportProjectsTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public previewImportProjects() {
    const spy = jest.spyOn(dms, 'PreviewImportProjects');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockPreviewImportProjects })
    );
    return spy;
  }

  public getProjectTips() {
    const spy = jest.spyOn(dms, 'GetProjectTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockProjectTips })
    );
    return spy;
  }

  public importDBServicesOfProjects() {
    const spy = jest.spyOn(dms, 'ImportDBServicesOfProjects');
    spy.mockImplementation(() => createSpySuccessResponse({ data: {} }));
    return spy;
  }

  public importDBServicesOfOneProject() {
    const spy = jest.spyOn(dms, 'ImportDBServicesOfOneProject');
    spy.mockImplementation(() => createSpySuccessResponse({ data: {} }));
    return spy;
  }

  public getImportDBServicesTemplate() {
    const spy = jest.spyOn(dms, 'GetImportDBServicesTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public importDBServicesOfProjectsCheck() {
    const spy = jest.spyOn(dms, 'ImportDBServicesOfProjectsCheck');
    spy.mockImplementation(() => {
      return new Promise<AxiosResponse<any>>((res) => {
        setTimeout(() => {
          res({
            status: 200,
            headers: {},
            config: {},
            statusText: '',
            data: new Blob(
              [
                JSON.stringify({
                  code: 0,
                  message: 'ok',
                  data: mockBatchImportDBCheckData
                })
              ],
              {
                type: MIMETypeEnum.Application_Json
              }
            )
          });
        }, 3000);
      });
    });
    return spy;
  }

  public importDBServicesOfOneProjectCheck() {
    const spy = jest.spyOn(dms, 'ImportDBServicesOfOneProjectCheck');
    spy.mockImplementation(() => {
      return new Promise<AxiosResponse<any>>((res) => {
        setTimeout(() => {
          res({
            status: 200,
            headers: {},
            config: {},
            statusText: '',
            data: new Blob(
              [
                JSON.stringify({
                  code: 0,
                  message: 'ok',
                  data: mockBatchImportDBCheckData
                })
              ],
              {
                type: MIMETypeEnum.Application_Json
              }
            )
          });
        }, 3000);
      });
    });
    return spy;
  }

  public dbServicesConnection() {
    const spy = jest.spyOn(dms, 'DBServicesConnection');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockDbServicesConnectionData })
    );
    return spy;
  }
}

export default new MockProjectApi();
