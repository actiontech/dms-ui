import { SupportTheme, SystemRole } from '../../enum';

export const mockCurrentUserReturn = {
  isAdmin: true,
  username: 'admin',
  isProjectManager: jest.fn(),
  bindProjects: [
    {
      is_manager: true,
      project_name: 'default',
      project_id: '1'
    },
    {
      is_manager: false,
      project_name: 'test',
      project_id: '2'
    }
  ],
  managementPermissions: [
    {
      code: 1,
      desc: '创建项目'
    }
  ],
  projectID: '1',
  projectName: 'default',
  theme: SupportTheme.LIGHT,
  role: SystemRole.admin
};

export const mockProjectInfo = {
  projectID: '700300',
  projectName: 'default',
  projectArchive: false
};
