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
import { AxiosResponse } from 'axios';
import { MIMETypeEnum } from '@actiontech/shared/lib/enum';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import DBService from '@actiontech/shared/lib/api/base/service/DBService';

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
    this.CheckGlobalDBServicesConnections();
  }

  public getProjectList() {
    const spy = jest.spyOn(Project, 'ListProjects');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: mockProjectList.length,
        data: mockProjectList
      })
    );
    return spy;
  }

  public addProject() {
    const spy = jest.spyOn(Project, 'AddProject');
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
    const spy = jest.spyOn(Project, 'UpdateProject');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteProject() {
    const spy = jest.spyOn(Project, 'DelProject');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public archiveProject() {
    const spy = jest.spyOn(Project, 'ArchiveProject');
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
    const spy = jest.spyOn(Project, 'UnarchiveProject');
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
    const spy = jest.spyOn(Project, 'ExportProjects');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public importProjects() {
    const spy = jest.spyOn(Project, 'ImportProjects');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getImportProjectsTemplate() {
    const spy = jest.spyOn(Project, 'GetImportProjectsTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public previewImportProjects() {
    const spy = jest.spyOn(Project, 'PreviewImportProjects');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockPreviewImportProjects })
    );
    return spy;
  }

  public getProjectTips() {
    const spy = jest.spyOn(Project, 'GetProjectTips');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockProjectTips })
    );
    return spy;
  }

  public importDBServicesOfProjects() {
    const spy = jest.spyOn(Project, 'ImportDBServicesOfProjects');
    spy.mockImplementation(() => createSpySuccessResponse({ data: {} }));
    return spy;
  }

  public importDBServicesOfOneProject() {
    const spy = jest.spyOn(DBService, 'ImportDBServicesOfOneProject');
    spy.mockImplementation(() => createSpySuccessResponse({ data: {} }));
    return spy;
  }

  public getImportDBServicesTemplate() {
    const spy = jest.spyOn(Project, 'GetImportDBServicesTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public importDBServicesOfProjectsCheck() {
    const spy = jest.spyOn(Project, 'ImportDBServicesOfProjectsCheck');
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
    const spy = jest.spyOn(DBService, 'ImportDBServicesOfOneProjectCheck');
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
    const spy = jest.spyOn(Project, 'DBServicesConnection');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockDbServicesConnectionData })
    );
    return spy;
  }

  public CheckGlobalDBServicesConnections() {
    const spy = jest.spyOn(Project, 'CheckGlobalDBServicesConnections');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }
}

export default new MockProjectApi();
