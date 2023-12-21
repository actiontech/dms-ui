import { SupportTheme, SystemRole } from '../../enum';

export const mockCurrentUserReturn = {
  isAdmin: true,
  isProjectManager: jest.fn(),
  username: 'admin',
  bindProjects: [
    {
      is_manager: true,
      project_name: 'default',
      project_id: '1',
      archived: false
    },
    {
      is_manager: false,
      project_name: 'test',
      project_id: '2',
      archived: false
    }
  ],
  managementPermissions: [
    {
      uid: '400300',
      name: '创建项目'
    }
  ],
  projectID: '1',
  projectName: 'default',
  theme: SupportTheme.LIGHT,
  role: SystemRole.admin,
  updateTheme: jest.fn(),
  useInfoFetched: true,
  uid: '500300'
};

export const mockProjectInfo = {
  projectID: '700300',
  projectName: 'default',
  projectArchive: false
};
