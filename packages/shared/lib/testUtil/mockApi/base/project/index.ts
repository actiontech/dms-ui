import { MockSpyApy, createSpySuccessResponse } from '../../common';
import {
  mockProjectList,
  mockPreviewImportProjects,
  mockBatchImportDBCheckData,
  mockDbServicesConnectionData,
  mockEnvironmentTagsData,
  mockBusinessTagsData,
  mockCheckDBServicesPrivilegesData
} from './data';
import { AxiosResponse } from 'axios';
import { MIMETypeEnum } from '../../../../enum';
import Project from '../../../../api/base/service/Project';
import DBService from '../../../../api/base/service/DBService';

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
    this.importDBServicesOfProjects();
    this.importDBServicesOfOneProject();
    this.getImportDBServicesTemplate();
    this.importDBServicesOfProjectsCheck();
    this.importDBServicesOfOneProjectCheck();
    this.dbServicesConnection();
    this.CheckGlobalDBServicesConnections();
    this.listEnvironmentTags();
    this.createEnvironmentTag();
    this.updateEnvironmentTag();
    this.deleteEnvironmentTag();
    this.listBusinessTags();
    this.createBusinessTag();
    this.updateBusinessTag();
    this.deleteBusinessTag();
    this.checkDBServicesPrivileges();
  }

  public getProjectList() {
    const spy = jest.spyOn(Project, 'ListProjectsV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: mockProjectList.length,
        data: mockProjectList
      })
    );
    return spy;
  }

  public addProject() {
    const spy = jest.spyOn(Project, 'AddProjectV2');
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
    const spy = jest.spyOn(Project, 'UpdateProjectV2');
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
    const spy = jest.spyOn(Project, 'ImportProjectsV2');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getImportProjectsTemplate() {
    const spy = jest.spyOn(Project, 'GetImportProjectsTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public previewImportProjects() {
    const spy = jest.spyOn(Project, 'PreviewImportProjectsV2');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockPreviewImportProjects })
    );
    return spy;
  }

  public importDBServicesOfProjects() {
    const spy = jest.spyOn(Project, 'ImportDBServicesOfProjectsV2');
    spy.mockImplementation(() => createSpySuccessResponse({ data: {} }));
    return spy;
  }

  public importDBServicesOfOneProject() {
    const spy = jest.spyOn(DBService, 'ImportDBServicesOfOneProjectV2');
    spy.mockImplementation(() => createSpySuccessResponse({ data: {} }));
    return spy;
  }

  public getImportDBServicesTemplate() {
    const spy = jest.spyOn(Project, 'GetImportDBServicesTemplate');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public importDBServicesOfProjectsCheck() {
    const spy = jest.spyOn(Project, 'ImportDBServicesOfProjectsCheckV2');
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
    const spy = jest.spyOn(DBService, 'ImportDBServicesOfOneProjectCheckV2');
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

  public listEnvironmentTags() {
    const spy = jest.spyOn(Project, 'ListEnvironmentTags');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockEnvironmentTagsData })
    );
    return spy;
  }

  public createEnvironmentTag() {
    const spy = jest.spyOn(Project, 'CreateEnvironmentTag');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateEnvironmentTag() {
    const spy = jest.spyOn(Project, 'UpdateEnvironmentTag');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteEnvironmentTag() {
    const spy = jest.spyOn(Project, 'DeleteEnvironmentTag');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public listBusinessTags() {
    const spy = jest.spyOn(Project, 'ListBusinessTags');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockBusinessTagsData })
    );
    return spy;
  }

  public createBusinessTag() {
    const spy = jest.spyOn(Project, 'CreateBusinessTag');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public updateBusinessTag() {
    const spy = jest.spyOn(Project, 'UpdateBusinessTag');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public deleteBusinessTag() {
    const spy = jest.spyOn(Project, 'DeleteBusinessTag');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public checkDBServicesPrivileges() {
    const spy = jest.spyOn(Project, 'CheckDBServicesPrivileges');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockCheckDBServicesPrivilegesData
      })
    );
    return spy;
  }
}

export default new MockProjectApi();
